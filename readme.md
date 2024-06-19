## NHttpd

### What's it?

It's a simple HTTP server, and it can execute JavaScript code when access the non-binary file and give the result back to the response.

For example:

```html
<js>return `Hello, world! Path: ${req.path}`</js>
```

### Usage

1. git clone https://github.com/MoonLeeeaf/NHttpd

2. npm install

3. node nhttpd.js [port]

4. put your resources into ./pages folder

5. enjoy it :D


### License

