import React from 'react';

// Here we define our query as a multi-line string
// Storing it in a separate .graphql/.gql file is also possible
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
}
`;


var all_anime = `
{
  Page(perPage: 2, page: 1) {
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
}
`;

// Define our query variables and values that will be used in the query request
var variables = {
    id: 106286  // weathering with you
};

// Define the config we'll need for our Api request
var url = 'https://graphql.anilist.co',
    options = {
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

// Make the HTTP Api request
class Anime extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            apiRes: "",
            src: "",
            title: "",
            coverImg: ""
        };
    }

    callAPI() {
        fetch(url, options).then(this.handleResponse)
            .then(this.handleData)
            .catch(this.handleError);
    }

    handleResponse(response) {
        return response.json().then(function (json) {
            return response.ok ? json : Promise.reject(json);
        });
    }

    handleData = (res) => {
        
        console.log(res);
        // console.log(res.data.Page.media[1].description);
        // console.log(res.data.Page.media[1].title.native);
        this.setState({
            apiRes: JSON.stringify(res),
            src: res.data.Media.bannerImage,
            title: res.data.Media.title.native,
            coverImg: res.data.Media.coverImage.extraLarge
        });
    }

    handleError(error) {
        alert('Error, check console');
        console.error(error);
    }


    // execute this function before call render
    componentWillMount() {
        this.callAPI();
    }

    render() {
        return (
            <div>
                <p>{this.state.apiRes}</p>
                <hr></hr>
                <h2>{this.state.title}</h2>
                <img src={this.state.src} width="60%"></img>
                <br></br>
                <img src={this.state.coverImg}></img>
            </div>
        );
    }
}

export default Anime;
