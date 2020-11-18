module.exports.errors = {
    504: '504 Request Timeout.',
    400: 'Client provided incorrect parameters for the request.',
    403: 'Access denied, either because of missing/incorrect credentials or used API token does not grant access to the requested resource.',
    404: 'Resource was not found/Invalid tag provided.',
    429: 'Request was throttled, because amount of requests was above the threshold defined for the used API token.',
    500: 'Unknown error happened when handling the request.',
    503: 'Service is temporarily unavailable because of maintenance.',
    200: 'ok'
};