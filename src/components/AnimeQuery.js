/**
 * AnimeQuery is a helper class to execute all kinds of AniList GraphQL query.
 */
class AnimeQuery {
    static searchAnime(searchKey, perPage, pageNum) {
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
                    media (type: ANIME, search: $key) {
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
            pageNum: pageNum
        };
        return callAPI(query_searchAnime, query_searchAnime_variables);
    }

    static getAnimeByID(id) {
        var query = `
            query ($id: Int) { 
                Media (id: $id, type: ANIME) {
                    id
                    title {
                        romaji
                        english
                        native
                    }
                    bannerImage
                    coverImage {
                        extraLarge
                        large
                        medium
                        color
                    }
                }
            }`;
        var variables = {
            id: id
        };
        return callAPI(query, variables);
    }

    static getAllAnime(perPage, pageNum) {
        var all_anime = `
            query ($perPage: Int, $pageNum: Int) {
                Page(perPage: $perPage, page: $pageNum) {
                    pageInfo {
                        total
                        perPage
                        currentPage
                        lastPage
                        hasNextPage
                    }
                    
                    media(type: ANIME) {
                        id
                        type
                        format
                        status
                        favourites
                        popularity
                        title {
                            romaji
                            english
                            native
                        }
                        duration
                        episodes
                        meanScore
                        averageScore
                        isAdult
                        description
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
                }
            }`;
        var variables = {
            perPage: perPage,
            pageNum: pageNum
        };
        return callAPI(all_anime, variables);
    }
}



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