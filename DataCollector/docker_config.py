import os

project_dir = os.getcwd()

#Docker
docker_image = 'dockerammu/docker_puppeteer_chromium_xvfb:ver7'
docker_user = 'pptruser'
docker_container_home = '/home/pptruser/'
docker_shared_dir_root = project_dir
vols = { docker_shared_dir_root + '/app'              :{'bind':docker_container_home + 'app','mode':'rw'}}
''', 
	docker_shared_dir_root + '/logs'          :{'bind':docker_container_home + 'logs','mode':'rw'},
	        docker_shared_dir_root + '/screenshots'   :{'bind':docker_container_home + 'screenshots','mode':'rw'},
            docker_shared_dir_root + '/resources'     :{'bind':docker_container_home + 'resources','mode':'rw'},
	       
	      }
'''

crawler_script = 'capture_screenshots.js'

CRAWL_MAX_CONTAINERS = 3
CRAWL_TIMEOUT = 180
ANALYSIS_MAX_CONTAINERS = 20
ANALYSIS_TIMEOUT = 1000
