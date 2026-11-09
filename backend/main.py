from __future__ import annotations

from contextlib import asynccontextmanager
from pathlib import Path

import httpx
from fastapi import FastAPI, Request, Response

UPSTREAM = "https://pickcat.dao3.fun"
FRONTEND_DIR = Path(__file__).resolve().parent.parent / "frontend" / "dist"

REQUEST_HEADERS = (
    "accept",
    "accept-language",
    "content-type",
    "cookie",
    "user-agent",
)

RESPONSE_HEADERS = (
    "content-type",
    "cache-control",
    "etag",
    "last-modified",
    "content-disposition",
    "content-language",
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    app.state.client = httpx.AsyncClient(
        base_url=UPSTREAM,
        follow_redirects=True,
        timeout=httpx.Timeout(30.0, connect=10.0),
    )
    try:
        yield
    finally:
        await app.state.client.aclose()


app = FastAPI(title="PICKCAT proxy", lifespan=lifespan)


async def _forward(request: Request, target: str) -> Response:
    client: httpx.AsyncClient = request.app.state.client

    url = target
    if request.url.query:
        url = f"{url}?{request.url.query}"

    headers = {}
    for name in REQUEST_HEADERS:
        value = request.headers.get(name)
        if value:
            headers[name] = value

    body = await request.body()

    upstream = await client.request(
        request.method,
        url,
        headers=headers,
        content=body if body else None,
    )

    out_headers = {}
    for name in RESPONSE_HEADERS:
        value = upstream.headers.get(name)
        if value:
            out_headers[name] = value

    response = Response(
        content=upstream.content,
        status_code=upstream.status_code,
        headers=out_headers,
    )

    # 保留多个 Set-Cookie 响应头，避免被 dict 合并
    for cookie in upstream.headers.get_list("set-cookie"):
        response.raw_headers.append((b"set-cookie", cookie.encode("latin-1")))

    return response


@app.api_route(
    "/api/{path:path}",
    methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS", "HEAD"],
)
async def proxy_api(path: str, request: Request) -> Response:
    return await _forward(request, f"/api/{path}")


@app.get("/healthz")
async def healthz() -> dict[str, str]:
    return {"status": "ok"}


app.frontend(
    "/",
    directory=str(FRONTEND_DIR),
    fallback="index.html",
    check_dir=False,
)
