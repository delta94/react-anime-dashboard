/**
 * AnimeQuery is a helper class to execute all kinds of AniList GraphQL query.
 */
class AnimeQuery {
    static searchMedia(searchKey, perPage, pageNum) {
        let query_searchAnime = `
            query ($key: String, $perPage: Int, $pageNum: Int) {
                Page(perPage: $perPage, page: $pageNum) {
                    pageInfo {
                        total
                        perPage
                        currentPage
                        lastPage
                        hasNextPage
                    }
                    media (search: $key) {
                        id
                        title {
                            romaji
                            english
                            native
                        }
                        bannerImage
                        coverImage {
                            large
                            medium
                            color
                        }
                    }
                }
            }`;
        let query_searchAnime_variables = {
            key: searchKey,
            perPage: perPage,
            pageNum: pageNum,
        };
        return callAPI(query_searchAnime, query_searchAnime_variables);
    }
    

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
                    nextAiringEpisode {
                        id
                    }
                    externalLinks {
                        id
                        url
                    }
                    chapters
                    volumes
                    favourites
                    popularity
                    meanScore
                    averageScore
                    trending
                    rankings {
                        id
                        rank
                        format
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
                    siteUrl
                    genres
                    title {
                        romaji
                        english
                        native
                    }
                    synonyms
                    duration
                    episodes    
                    isAdult
                    description(asHtml: true)
                    trailer {
                        id
                        site
                        thumbnail
                    }
                    characters {
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
                }
            }`;
        let variables = {
            id: id,
        };
        return callAPI(query, variables);
    }

    static getAllMedia(type, perPage, pageNum) {
        var mytype = type.toUpperCase() === "ANIME" ? TYPE.ANIME : TYPE.MANGA;
        let all_anime = `
            query ($perPage: Int, $pageNum: Int, $type: MediaType) {
                Page(perPage: $perPage, page: $pageNum) {
                    pageInfo {
                        total
                        perPage
                        currentPage
                        lastPage
                        hasNextPage
                    }
                    media(type: $type) {
                        id
                        type
                        title {
                            romaji
                            english
                            native
                        }
                        meanScore
                        averageScore
                        description
                        coverImage {
                            large
                            medium
                            color
                        }
                    }
                }
            }`;
        let variables = {
            perPage: perPage,
            pageNum: pageNum,
            type: mytype,
        };
        return callAPI(all_anime, variables);
    }

    // wrapper
    static getAllAnime(perPage, pageNum) {
        return AnimeQuery.getAllMedia("ANIME", perPage, pageNum);
    }

    // wrapper
    static getAllManga(perPage, pageNum) {
        return AnimeQuery.getAllMedia("MANGA", perPage, pageNum);
    }

    static getMediaByPopularity(type, perPage, pageNum) {
        var mytype = type.toUpperCase() === "ANIME" ? TYPE.ANIME : TYPE.MANGA;
        let query = `
            query ($perPage: Int, $pageNum: Int, $type: MediaType) {
                Page(perPage: $perPage, page: $pageNum) {
                    pageInfo {
                        total
                        perPage
                        currentPage
                        lastPage
                        hasNextPage
                    }
                    media(type: $type, sort: POPULARITY_DESC) {
                        id
                        title {
                            romaji
                            english
                            native
                        }
                        coverImage {
                            extraLarge
                            large
                            medium
                            color
                        }
                    }
                }
            }`;
        let variables = {
            perPage: perPage,
            pageNum: pageNum,
            type: mytype,
        };
        return callAPI(query, variables);
    }

    // wrapper
    static getAllAnimeByPopularity(perPage, pageNum) {
        return AnimeQuery.getMediaByPopularity("ANIME", perPage, pageNum);
    }

    // wrapper
    static getAllMangaByPopularity(perPage, pageNum) {
        return AnimeQuery.getMediaByPopularity("MANGA", perPage, pageNum);
    }

    static getMediaByLatest(type, perPage, pageNum) {
        var mytype = type.toUpperCase() === "ANIME" ? TYPE.ANIME : TYPE.MANGA;
        var today = new Date();
        var todayStr =
            today.getFullYear().toString() +
            (today.getMonth() + 1).toString().padStart(2, "0") +
            today.getDate().toString().padStart(2, "0");
        var todayInt = parseInt(todayStr);

        let query = `
            query ($perPage: Int, $pageNum: Int, $type: MediaType, $today: FuzzyDateInt) {
                Page(perPage: $perPage, page: $pageNum) {
                    pageInfo {
                        total
                        perPage
                        currentPage
                        lastPage
                        hasNextPage
                    }
                    media(type: $type, startDate_lesser: $today, sort: START_DATE_DESC) {
                        id
                        title {
                            romaji
                            english
                            native
                        }
                        coverImage {
                            large
                            medium
                        }
                        startDate {
                            year
                            month
                            day
                        }
                    }
                }
            }`;
        let variables = {
            perPage: perPage,
            pageNum: pageNum,
            type: mytype,
            today: todayInt,
        };
        return callAPI(query, variables);
    }
}

// declare Enum type
const TYPE = {
    ANIME: "ANIME",
    MANGA: "MANGA"
};


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
        alert('Error, check console');
        console.error(error);
    }

    return call();
}

export default AnimeQuery;