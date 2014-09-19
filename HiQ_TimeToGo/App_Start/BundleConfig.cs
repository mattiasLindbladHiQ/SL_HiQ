using System.Web;
using System.Web.Optimization;

namespace HiQ_TimeToGo
{
    public class BundleConfig
    {
        // For more information on Bundling, visit http://go.microsoft.com/fwlink/?LinkId=254725
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/scripts").Include(
                "~/Scripts/plugins/plugins.js",
                "~/Scripts/settings.js",
                "~/Scripts/mockResponse.js",
                "~/Scripts/app.js"));

            bundles.Add(new StyleBundle("~/Content/css").Include(
            	"~/Content/normalize.css",
            	"~/Content/helpers.css",
            	"~/Content/base.css"));
        }
    }
}