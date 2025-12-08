using Microsoft.AspNetCore.StaticFiles;

namespace src;

public static class WebApplicationExtensions
{
    public static IApplicationBuilder UseUnifyStaticSite(this WebApplication app)
    {
        var provider = new FileExtensionContentTypeProvider
        {
            Mappings =
            {
                [".webmanifest"] = "application/manifest+json",
                [".pf_meta"] = "application/wasm",
                [".pf_index"] = "application/wasm",
                [".pf_fragment"] = "application/wasm",
                [".pagefind"] = "application/wasm",
                [".webp"] = "image/webp",
                [".avif"] = "image/avif"
            }
        };

        app.UseFileServer()
            .UseStaticFiles(new StaticFileOptions
            {
                ContentTypeProvider = provider
            });

        return app;
    }
}