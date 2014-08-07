function getDomainOfUrl(url) {
	if(!url) return "";
    var parts = url.split("/");
    var domain = parts[0]+"//"+parts[2];
    return domain;
}