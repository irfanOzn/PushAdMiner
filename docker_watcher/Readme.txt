# docker-watcher
Keep track of running docker containers and analyze network traffic usage. Logs follow a naming convention *container_interface_date* and will be rotated or not according to a given  parameter.

## Usage

```sh
$ ./docker-watcher.sh -d|--discovery <discovery_time> -t|--t <time_period> -r|--rotate <yes/no> -n|--network <network> (default: all) -o|--output <output_folder>
```

  * **discovery_period**: is the interval time for the script to wait to check if new containers have been started.
  * **time_period**: is the elapsed time to store new traffic dumps.
  * **rotate**: whether or not to rotate logs
  * **network**: the docker network to observe
  * **output_folder**: the output folder where pcaps will be stored.

## Example

```sh
$ ./docker-watcher.sh -d 5 -t 3 -r yes -n etmsplatform_default
```

This will check the running dockers every 5 seconds and create a new pcap file for each container every 3 seconds. The output will be like:

```sh
  pcap/
    interface1/
      container1/
        container1_br-31cc34v_2017-01-31_11:07:08.pcap
        container1_br-31cc34v_2017-01-31_11:07:14.pcap
      container2/
        container2_br-31cc34v_2017-01-31_11:07:10.pcap
    network_name_br-31cc34v_2017-01-31_11:07:10.pcap
      ...
```

As seen, the file structure allows for easy future processing. Each group of containers connected to the same network (same interface accesible by the host)
will be created under the same folder named after the interface, and also inside a folder with the container's name.
The name of the container .pcap files follows the convention of *<container-name>_<network_interface>_<creation_date>*.
A capture file is created with all the traffic going through a single network interface, while for each container only it's own inbound/outbound traffic is
logged.

Command : sudo ./docker-watcher.sh -d 15 -t 3 -r yes
