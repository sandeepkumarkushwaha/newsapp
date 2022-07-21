import React, {useState, useEffect} from 'react';
import NewsItem from '../NewsItem/NewsItem';
import Spinner from '../Spinner/Spinner';import PropTypes from "prop-types";
import "./News.css";
import InfiniteScroll from 'react-infinite-scroll-component';

const News = (props) => {

  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const updateNews = async () => {
    const url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apiKey}&page=${page}&pageSize=${props.pageSize}`;
    setLoading(true);
    let data = await fetch(url);
    let parsedData = await data.json();
    props.setProgress(30);
    props.setProgress(70);
    setArticles(parsedData.articles);
    setTotalResults(parsedData.totalResults);
    setLoading(false);
    props.setProgress(100);
  }

  useEffect(() => {
    // document.title =  `${capitalizeFirstLetter(props.category)} - NewsMonkey`;
    updateNews();
  }, []);
  

  const fetchMoreData = async () => {
    const url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apiKey}&page=${page+1}&pageSize=${props.pageSize}`;
    setPage(page + 1)
    let data = await fetch(url);
    let parsedData = await data.json();
    setArticles(articles.concat(parsedData.articles));
    setTotalResults(parsedData.totalResults);
  }


  return (
    <>
    <div className="news-heading">
      <h1>NewsMonkey - Top {capitalizeFirstLetter(props.category)} Headlines</h1>
      {loading && <Spinner/> }
    </div>
      <InfiniteScroll  dataLength={articles.length} next={fetchMoreData} hasMore={articles.length !== totalResults} loader={ <Spinner />} >
       
        <section className="news-section news-container">

    {articles.map((element) => {
      return (
    <div className='' key={element.url}>
      <NewsItem
        title={element.title ? element.title : ""}
        description={element.description ? element.description : ""}
       imageUrl={element.urlToImage}
       newsUrl = {element.url}
       author={element.author}
       date={element.publishedAt}
       source={element.source.name}
        />
    </div>
      )
    })}
        </section>
        
      </InfiniteScroll>
    </>
  )
}

News.defaultProps = {
    country: "in",
    pageSize: 8,
    category: 'general'
}
News.propTypes = {
  country: PropTypes.string,
  pageSize: PropTypes.number,
  category: PropTypes.string,
}

export default News