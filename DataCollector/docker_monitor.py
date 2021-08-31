import docker
import os
import time
import datetime
import logging
import tarfile

from docker_config import *

client = docker.from_env()


logging.basicConfig(filename='output2.log', filemode='w', format='%(name)s - %(funcName)20s() - %(message)s',level=logging.INFO)
export_path = './containers_data/container_'

def get_time():
	currentDT = datetime.datetime.now()
	return '['+currentDT.strftime("%Y-%m-%d %H:%M:%S") +'] '

def initiate_container(url, id, script_name, iteration_count,  container_timeout):	
    try:
        ## create and setup container ##
        logging.info(get_time() + 'container_'+id+' creating!!')
        container_id  = client.containers.create(image=docker_image,name='container_'+id,volumes = vols,
                                                shm_size='1G', user=docker_user, 
                                                publish_all_ports=True, detach=False)
        container = client.containers.get('container_'+str(id))
        container.start()
        logging.info(get_time() + 'container_'+id+' created successfully!!')    
        
        ## wait for display to be activated ##
        time.sleep(10)
        ## Exeecute the browser automation script
        execute_script(url, id, script_name,  iteration_count, container_timeout-60)
    except Exception as e:
        logging.info(e) 

def execute_script(url, id, script_name,  iteration_count, container_timeout):
    try:	
        ## Execute javascript file
        logging.info(get_time() +'container_'+id+': Executing javascript')
        container = client.containers.get('container_'+str(id))               
        #logs = container.attach(stream=True,stdout=True,stderr=True)
        _,logs = container.exec_run(cmd=['node',script_name,url,id,str(iteration_count),str(container_timeout)], user=docker_user, detach=False, stream=True)
        time.sleep(container_timeout)        
        # for log in logs:
        #     logging.info('Container_'+id+'LOG :: '+log.decode('UTF-8'))
    
        logging.info(get_time() +'container_'+id+': Execution complete!!')	
        export_container(id, iteration_count)
    except Exception as e:
        logging.info('Exception ')
        logging.info(e)

def stop_container(id):
    try:
        container = client.containers.get('container_'+str(id))
        if container:
            logging.info(get_time() + 'container_'+id+' stopping!!')
            container.pause()
            time.sleep(2)
            container.stop()
    except Exception as e:
        logging.info(e)

def remove_previous_containers():
    		
    try:
        for c in client.containers.list():
            if 'tes' in c.name:
                c.stop()
                c.remove()
    except Exception as e:
        print(e)
  
def export_container(id, count):
    container = client.containers.get('container_'+str(id))
    logging.info(get_time() + 'container_'+id+'_'+str(count)+' exporting files!!')
    dir_path = export_path+id+'/'
    if not os.path.exists(dir_path):
        os.makedirs(dir_path)
    dir_path = dir_path+ str(count)+'/'
    if not os.path.exists(dir_path):
        os.makedirs(dir_path)
    with open(dir_path+'screenshots.tar', 'wb') as f:
        bits, stat = container.get_archive('/home/pptruser/screenshots/')
        for chunk in bits:
            f.write(chunk)
   
    with open(dir_path+'chrome_log.tar', 'wb') as f:
        bits, stat = container.get_archive('/home/pptruser/chromium/chrome_debug.log')
        for chunk in bits:
            f.write(chunk)
   


def docker_prune():
    ## Remove containers that are unused  ##
    try:
        client.containers.prune()		
    except Exception as e:
        logging.info(e)


def test():
    remove_previous_containers()
    initiate_container('https://gauntface.github.io/simple-push-demo/','tes_100', 'capture_screenshots.js','0', 180 )    
    
if __name__== "__main__":
    test()
