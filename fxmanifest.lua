fx_version 'cerulean'
game 'gta5'

shared_scripts {
	"@ox_lib/init.lua",
}

server_script 'dist/server/**/*.js'
client_script 'dist/client/**/*.js'

dependencies {
    'ox_lib',
    'ox_inventory',
    'qbx_core',
}

lua54 'yes'