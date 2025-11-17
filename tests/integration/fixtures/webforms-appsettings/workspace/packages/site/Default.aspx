<%@ Page Language="C#" AutoEventWireup="true" CodeFile="Default.aspx.cs" Inherits="WebApp_Default" %>
<!DOCTYPE html>
<html>
<head runat="server">
    <title>Telemetry Injection</title>
    <script src="Scripts/app-insights.js"></script>
</head>
<body>
    <form id="form1" runat="server">
        <asp:HiddenField ID="AppInsightsInstrumentationKey" runat="server" />
        <script type="text/javascript">
            window.addEventListener("load", function () {
                initializeTelemetry();
            });
        </script>
    </form>
</body>
</html>
