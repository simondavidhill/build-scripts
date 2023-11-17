function FindProxyForURL(url, host) {
    // define variables
    var PRIMARY = "PROXY pri.proxy.net:3128; ";                 // primary proxy hostname and port
    var SECONDARY = "PROXY sec.proxy.net:3128; ";               // alternate proxy hostname and port
    var TERTIARY = "PROXY ter.proxy.net:3128; ";                // additional alternate proxy hostname and port
    var internalSite = /^(.*\.company\.com|.*\.local\.net)$/;   // RegEx which matches any internal corporate sites and domains
    var privateIPv4 = /^(0|100\.64|169\.254|192\.0\.0|192\.0\.2|192\.88\.99|198\.1[89]|198\.51\.100|203\.0\.113|22[4-9]|23[0-9]|24[0-9]|25[0-5])\.[0-9.]+$/; // RegEx which matches any special IPv4 address
    var lanIPv4 = /^(10|127|172\.(1[6-9]|2[0-9]|3[0-1])|192\.168)\.[0-9.]{3,11}$/;  // RegEx which matches any private LAN IPv4 address
    var isIPv4 = /^(\d{1,3}\.){3}\d{1,3}$/;                     // RegEx which matches *any* IPv4 address
    url = url.toLowerCase(); host = host.toLowerCase();         // change url and host to lower case for reliable matching
    // proxy logic
    if (isPlainHostName(host)) { return "DIRECT"; }             // don't proxy plain NetBIOS-names
    if (url.substring(0, 4) !== 'http') { return "DIRECT"; }    // don't proxy for ftp / file or any other oddball requests
    if (internalSite.test(host)) { return "DIRECT"; }           // don't proxy for hosts and servers in the internal domain
    if (isIPv4.test(host)) { host_ip = host; } else { host_ip = dnsResolve(host); }  // extract an IP address for use in network matching rules
    if (host_ip == ( 0 || null)) { return PRIMARY + SECONDARY; }// if host IP address cannot be resolved use the proxy (no point going direct)
    if (privateIPv4.test(host_ip)) { return "DIRECT"; }         // don't proxy for any 'special-purpose' IP addresses (RFC 6890)
    if (lanIPv4.test(host_ip)) { return "DIRECT"; }             // don't proxy for any LAN IP addresses
    // load-balance traffic across multiple proxy servers
    var ipOctets = host_ip.split(".");                          // split the destination ip into octets
    var lastOctet = parseInt(ipOctets[3], 10);                  // select last octet of IP address (in base-10)
    switch (lastOctet % 3) {                                    // choose based on mod3 of last octet
      case 0: { return PRIMARY + SECONDARY; }                   // load-balanced
      case 1: { return SECONDARY + TERTIARY; }                  //   across multiple
      case 2: { return TERTIARY + PRIMARY; } }                  //        proxy servers
    // non load-balancing version
    { return PRIMARY + SECONDARY + "DIRECT"; }                  // all else fails: proxy server(s) in preference order, if none available go DIRECT (optional)
}
