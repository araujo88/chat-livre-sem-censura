<?php

class CORSMiddleware
{
    /* Process an incoming server request and return a response, 
     * optionally delegating response creation to a handler.  */
    public function process(
        ServerRequestInterface $request, 
        RequestHandlerInterface $handler
    ): ResponseInterface
    {
        // handle other requests
        $response = $handler->handle($request);

        // Set CORS to allowed origins
        $response->headers->set('Access-Control-Allow-Origin: *');
        $response->headers->set('Access-Control-Allow-Methods: GET, POST, OPTIONS');
        $response->headers->set("Access-Control-Allow-Headers: X-Requested-With");

        // return the response
        return $response;
    }
}

class SecurityMiddleware
{
    /* Process an incoming server request and return a response, 
     * optionally delegating response creation to a handler.  */
    public function process(
        ServerRequestInterface $request, 
        RequestHandlerInterface $handler
    ): ResponseInterface
    {
        // handle other requests
        $response = $handler->handle($request);

        // Security headers
        $response->headers->set('Cross-Origin-Opener-Policy: same-origin');
        $response->headers->set('Referrer-Policy: strict-origin-when-cross-origin');
        $response->headers->set('Strict-Transport-Security: max-age=31556926; includeSubDomains');
        $response->headers->set('X-Content-Type-Options: nosniff');
        $response->headers->set('X-Frame-Options: DENY');
        $response->headers->set('X-XSS-Protection: 1; mode=block');

        // return the response
        return $response;
    }
}

