require "rgeo"
require 'csv'
require 'rgeo/geo_json'

puts "Yay" if RGeo::Geos.capi_supported?

huc8File = 'geojson/huc8.geojson'
huc10File = 'geojson/huc10.geojson'
huc12File = 'geojson/huc12.geojson'
statesFile = 'geojson/basin-states.geojson'
countiesFile = 'geojson/counties.geojson'

indexes = %w(huc8 huc10 huc12 state county)
idColumns = %w(huc8 huc10 huc12 statefp countyfp)


siteFiles = Dir.glob('sites/**/*.csv')
features = {}

indexes.each do |index|
	file = 'geojson/' + index + '.geojson'
	features[index] = RGeo::GeoJSON.decode(File.read(file))
end


def rowToPoint(row)
	RGeo::Geographic.spherical_factory.point(row['lon'].to_f, row['lat'].to_f)
end

indexRows = ['siteId,' + indexes.join(',')]
siteFiles.each do |file|
	rows = CSV.read(file, headers: true)
	rows.each do |row|
		rowColumns = [row['siteId']]

		point = rowToPoint(row)
		indexes.each_with_index do |indexName, i|
			matching_feature = features[indexName].find { |feature| feature.geometry.contains?(point) }
			idColumn = idColumns[i]
			id = matching_feature ? matching_feature[idColumn] : ''
			rowColumns << id
		end

		indexRows << rowColumns.join(',')
	end
end

File.write('indexes/sites.csv', indexRows.join("\n"))
