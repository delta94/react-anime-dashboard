/*  config object documentation
const config_info = {
    type: 'anime' | 'manga' | "",
    search: "search_name" | "",
    season: 'spring' | 'summer' | 'fall' | 'winter' | "",
    seasonYear: (1900 - 2100), 
    startDate: true | false,
    sort: "latest" | "popularity" | "popularity_desc" | "id" | "id_desc" | "",
    isAdult: true | false | "all",
    popularity: true | false,
    startDate: true | false,
    nextAiringEpisode: true | false,
};
*/

/**
 * AnimeQuery is a helper class to execute all kinds of AniList GraphQL query.
 */
class AnimeQuery {
    /**
     * get a list of medias by custom config.
     * @param {number} perPage number of medias to request
     * @param {number} pageNum page number
     * @param {Object} config custom config object
     */
    static getCustomMedia(perPage, pageNum, config) {
        // media filter variable
        let type = ``, search, season = ``, seasonYear = ``, isAdult=`isAdult: false,`, sort=`` ;
        // media property variable
        let popularity = ``, startDate = ``, nextAiringEpisode = ``;
        let today, todayFlag = false;

        if (config) {
            // handle media type
            if (config.type) {
                if (config.type.toUpperCase() === 'ANIME')
                    type = `type: ANIME,`;
                else if (config.type.toUpperCase() === 'MANGA')
                    type = `type: MANGA`;
                else
                    type = ``;
            }

            // handle search key
            if (config.search) {
                if (config.search !== '')
                    search = config.search;
            }

            // get popularity data ?
            if (config.popularity === true) {
                popularity = `popularity`;
            }

            // get start date ?
            if (config.startDate === true) {
                startDate = `startDate {
                                year
                                month
                                day
                            }`;
            }

            // get next airing episode data ?
            if (config.nextAiringEpisode === true) {
                nextAiringEpisode = `nextAiringEpisode {
                                        id
                                        episode
                                        airingAt
                                        timeUntilAiring
                                        mediaId
                                    }`;
            }

            // handle season filter
            if (config.season) {
                if (config.season.toUpperCase() === 'SPRING')
                    season = `season: SPRING,`;
                else if (config.season.toUpperCase() === "SUMMER")
                    season = `season: SUMMER,`;
                else if (config.season.toUpperCase() === "FALL")
                    season = `season: FALL,`;
                else if (config.season.toUpperCase() === "WINTER")
                    season = `season: WINTER,`;
                else
                    season = ``; // any season
            }

            // handle season year filter
            if (config.seasonYear) {
                let year = parseInt(config.seasonYear);
                if (year > 1900 && year < 2100) {
                    seasonYear = `seasonYear: ${year},`;
                } else {
                    seasonYear = ``;  // any season year
                }
            }

            // handle adult content filter, default is prohibited by my initial setting above.
            if (config.isAdult) {
                if (config.isAdult === true)
                    isAdult = `isAdult: true,`;
                else if (config.isAdult === 'all')
                    isAdult = ``;
                else
                    isAdult = `isAdult: false,`;
            }

            // handle content sorting
            if (config.sort) {
                if (config.sort.toUpperCase() === "LATEST") {
                    today = getTodayDateInt();
                    sort = `startDate_lesser: $today, startDate_greater: 19700101, sort: START_DATE_DESC`;
                    todayFlag = true;
                } else if (config.sort.toUpperCase() === "POPULARITY")
                    sort = `sort: POPULARITY`;
                else if (config.sort.toUpperCase() === "POPULARITY_DESC")
                    sort = `sort: POPULARITY_DESC`;
                else if (config.sort.toUpperCase() === "ID") sort = `sort: ID`;
                else if (config.sort.toUpperCase() === "ID_DESC") sort = `sort: ID_DESC`;
                else sort = ``;
            }
        }

        let query = `
            query ($perPage: Int, $pageNum: Int, $searchKey: String, ${todayFlag ? `$today: FuzzyDateInt` : ``} ) {
                Page(perPage: $perPage, page: $pageNum) {
                    pageInfo {
                        total
                        perPage
                        currentPage
                        lastPage
                        hasNextPage
                    }
                    media (${type} ${season} ${seasonYear} ${isAdult} ${sort} search: $searchKey) {
                        id
                        title {
                            romaji
                            english
                            native
                        }
                        coverImage {
                            large
                        }
                        ${popularity}
                        ${startDate}
                        ${nextAiringEpisode}
                    }
                }
            }`;
        let query_variables = {
            searchKey: search,
            perPage: perPage,
            pageNum: pageNum,
            today: today
        };
        return callAPI(query, query_variables);
    }

    /**
     * get all information about a media by its id.
     * @param {number} id media id
     */
    static getMediaByID(id) {
        let query = `
            query ($id: Int) {
                Media (id: $id) {
                    id
                    type
                    format
                    source
                    status
                    season
                    seasonYear
                    seasonInt
                    updatedAt
                    countryOfOrigin
                    externalLinks {
                        id
                        url
                    }
                    duration
                    episodes
                    chapters
                    volumes
                    favourites
                    popularity
                    meanScore
                    averageScore
                    trending
                    studios(isMain: true) {
                        edges {
                            id
                            node {
                                name
                            }
                        }
                    }
                    stats {
                        scoreDistribution {
                            score
                            amount
                        }
                        statusDistribution {
                            status
                            amount
                        }
                    }
                    genres
                    title {
                        romaji
                        english
                        native
                    }
                    synonyms   
                    isAdult
                    description
                    characters(sort: ROLE, perPage: 12, page: 1) {
                        pageInfo {
                            total
                            perPage
                            currentPage
                            lastPage
                            hasNextPage
                        }
                        edges {
                            id
                            node {
                                name {
                                    first
                                    last
                                    full
                                    native
                                }
                                image {
                                    large
                                    medium
                                }
                                description
                            }
                            role
                        }
                    }
                    startDate {
                        year
                        month
                        day
                    }
                    endDate {
                        year
                        month
                        day
                    }
                    coverImage {
                        extraLarge
                        large
                        medium
                        color
                    }
                    bannerImage
                    tags {
                        id
                        name
                    }
                    streamingEpisodes {
                        title
                        thumbnail
                        url
                        site
                    }
                }
            }`;
        let variables = {
            id: id,
        };
        return callAPI(query, variables);
    }
}

function getTodayDateInt() {
    var today = new Date();
    var todayStr =
        today.getFullYear().toString() +
        (today.getMonth() + 1).toString().padStart(2, "0") +
        today.getDate().toString().padStart(2, "0");
    var todayInt = parseInt(todayStr);
    return todayInt;
}

/**
 * Default function to call AniList GraphQL API.
 * @param {*} query - A GraphQL query
 * @param {*} variables - query variables
 */
function callAPI(query, variables) {
    const anilist_url = 'https://graphql.anilist.co';
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify({
            query: query,
            variables: variables
        })
    };

    async function call() {
        try {
            const response = await fetch(anilist_url, options);
            const res = await handleResponse(response);
            return handleData(res);
        }
        catch (error) {
            return handleError(error);
        }
    }

    function handleResponse(response) {
        return response.json().then(function (json) {
            return response.ok ? json : Promise.reject(json);
        });
    }

    function handleData(res) {
        console.log(res);
        return res;
    }

    function handleError(error) {
        // alert('Error, check console');
        console.error(error);
        return error;
    }

    return call();
}

export default AnimeQuery;