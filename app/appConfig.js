define([], function () {
    'use strict';

    var LiquidConfig = {

        "Dev": {
            "URI": {
                "ENDPOINT": "http://hyd.semanooor.com/liquid.Dev/",
                "AUTH_TOKEN": "http://hyd.semanooor.com/liquid.auth/",
                "MEDIA": "http://hyd.semanooor.com/liquid.Dev/MediaLibrary/",
                "CHARACTER": "https://dev-liquid.semanoor.com/common/character/",
                "COMMON": "https://dev-liquid.semanoor.com/common/",
                "GRAPHQL": "https://dev-liquidgql.semanoor.com/graphql"
            },
            "STATUS": {
                "SEARCH": "SEARCH",
                "DEFAULT": "DEFAULT"
            },
            "API": {
                "FE_KEY": "nD4C2E1A2wG1G1A3C3B1D7B4E1D4F4jB-22qhorxC2mzmd1llkwH4dgd=="
            },
            "Ver": {
                "version": "1.2.3",
                "ReleaseDate": "26 Nov 2018",
                "Description": "Bug Fixes"
            }


        }



    };

    return LiquidConfig;

})