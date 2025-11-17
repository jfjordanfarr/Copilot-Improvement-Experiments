using System;
using System.Configuration;
using System.Web.UI;
using System.Web.UI.WebControls;

public partial class WebApp_Default : Page
{
    protected HiddenField AppInsightsInstrumentationKey;

    protected void Page_Load(object sender, EventArgs e)
    {
        var instrumentationKey = ConfigurationManager.AppSettings["AppInsightsInstrumentationKey"];
        if (!string.IsNullOrEmpty(instrumentationKey))
        {
            AppInsightsInstrumentationKey.Value = instrumentationKey;
        }
    }
}
