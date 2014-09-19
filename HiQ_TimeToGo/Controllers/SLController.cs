using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Text;
using System.Threading.Tasks;
using System.Net;

namespace HiQ_TimeToGo.Controllers
{
    public class SLController : Controller
    {
        //
        // GET: /SL/

        public ActionResult Index()
        {
            return View();
        }

        public string getSLData(string key, string siteId, string timeInMinutes)
        {
            string format = "json";
            string url = "http://api.sl.se/api2/realtimedepartures." + format + "?key=" + key + "&siteid=" + siteId + "&timewindow=" + timeInMinutes + "";

            var syncClient = new WebClient();
            var content = syncClient.DownloadString(url);

            byte[] bytes = Encoding.Default.GetBytes(content);
            content = Encoding.UTF8.GetString(bytes);

            return content;
        }

    }
}
