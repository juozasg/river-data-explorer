today = Time.now.strftime("%F ")

url = "https://waterservices.usgs.gov/nwis/dv/?format=json&sites=\
04096405,04096515,04097500,040975299,04097540,04099000,04100500,04101000,04101500,04101535,04101800,04102500,04099750&statCd=00003\
&siteStatus=all\
&startDT=2000-01-01
\&endDT=#{today}"

# TODO: get data from url.
# cache for one day.
# serve as static endpoint url
