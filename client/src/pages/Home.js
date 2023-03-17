import React, { useState, useEffect } from "react";
import sb from "../utils/bookSearch";
import { useSelector, useDispatch } from "react-redux";
import {ALL_BOOKS, DB_BOOKS} from "../utils/action"

import Hero from "../components/Hero";
import ShowResults from "../components/ShowResults";
import gBookSearch from '../utils/bookSearch';
import api from "../api/index"

export default function Home({
  searchText, setSearchText
}) {
  const dispatch = useDispatch();
  const [bookSearched, setBookSearched] = useState([]);

  const [searchHistory, setSearchHistory] = useState([]);

  useEffect(() => {
    gBookSearch.googleSearchHandler(searchText).then(data => {
      setBookSearched(data);
    });

    api.getAllBooks().then((data) => {
      console.log(data.data.data)
      if(data.data.data && data.data.data.length > 0) {
        dispatch({
          type: DB_BOOKS,
          dbbooks: data.data.data
        });
      }
    })

    console.log(bookSearched)
  }, []);
 
  useEffect(() => {
    if(bookSearched && bookSearched.length > 0) {
      dispatch({
        type: ALL_BOOKS,
        allbooks: bookSearched
      });
    }
    //console.log(searchText, bookSearched)
  }, [bookSearched]);

  return (
    <div>
      <Hero
        bookSearched = {bookSearched}
        setBookSearched = {setBookSearched}
        searchHistory = {searchHistory}
        setSearchHistory = {setSearchHistory}
        searchText = {searchText}
        setSearchText = {setSearchText}
      />
      <div className="mx-auto mb-3 m-lg-2 searchTitle d-flex justify-content-center">Results for - {searchText}</div>
      <ShowResults/>
    </div>
  )
}