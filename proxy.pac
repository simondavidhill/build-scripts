function FindProxyForURL(url, host) {

    // no proxy if the client is roaming outside 10.0.0.0/8 (this function is a little unreliable)
    // if (shExpMatch(myIpAddress(), "10.*"));
    // else { return "DIRECT"; }

    // set proxy hostnames and ports
    var PRIMARY = "PROXY pri.proxy.net:3128; ";
    var SECONDARY = "PROXY sec.proxy.net:3128; ";

    // define RegEx for IP address matching
    var isIPv4Addr = /^(\d{1,3}\.){3}\d{1,3}$/;
    var privateIP = /^(0|10|100\.64|127|169\.254|172\.1[6-9]|172\.2[0-9]|172\.3[01]|192\.0\.0|192\.0\.2|192\.88\.99|192\.168|198\.1[89]|198\.51\.100|203\.0\.113|22[4-9]|23[0-9]|24[0-9]|25[0-5])\.[0-9.]+$/;
    var host_ip;
    
    // change everything to lower case for reliable matching
    url = url.toLowerCase();
    host = host.toLowerCase();

    // don't proxy ftp / file or any other oddball requests
    if (url.substring(0, 4) !== 'http') { return "DIRECT"; }

    // don't proxy plain NetBIOS-names
    if (isPlainHostName(host)) { return "DIRECT"; }     // Alternately if (dnsDomainLevels(host) < 2)

    // don't proxy for hosts and servers in the internal doamin
    if (shExpMatch(host, "*.corp.company.com") ||
        shExpMatch(host, "*.dns.company.com")) { return "DIRECT"; }

    // extract an IP address for use in network matching rules (uses a single DNS lookup)
    if (isIPv4Addr.test(host))
    // if the URL already contains an IP address we can just use it
        host_ip = host;
    else
    // resolve any FQDNs in the URL to an IP address
        host_ip = dnsResolve(host);

    // if host IP address cannot be resolved use proxy
    if (host_ip == 0 || host_ip === null) { return PRIMARY + SECONDARY + "DIRECT"; }

    // Use RegEx to ensure we don't proxy for any 'special-purpose' IP addresses (RFC 6890)
    if (privateIP.test(host_ip)) { return "DIRECT"; }

    // eveything else goes through a proxy server(s) in preference order, if none available go DIRECT (optional)
    { return PRIMARY + SECONDARY + "DIRECT"; }
}
