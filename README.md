Mediator
========

An FRC compliant server application that accepts json data and put them
in a queue for delivery.

Technically could be modified for any uses.. but really is kinda useless
other than to simplify development (skip server development)

Target platform: Linux

Requirement:

 - Flask
 - Gevent
 - Python 2.7

Code style: Google code style for python.

Usage
=====

Usage is simple. You have access to 2 queues (maybe more later version) and 1
kv storage (maybe you could create your own later).

    GET /q/commands -> This gets the next command from the queue
    POST /q/commands -> enqueues a new command
      Takes data=<yourdatahere> (for the POST data)

Same thing for /q/data

For kv store, the url is /kv/<your_key_name>

    GET /kv/somekey -> This gets the value that's associated with the key of 'somekey'
    POST /kv/somekey -> Stores the value as noted by your data into 'somekey'
      Takes data=<yourdatahere> (for the POST data)
    DELETE /kv/somekey -> Deletes that key

For all of above, if they're not found, it will 404.
