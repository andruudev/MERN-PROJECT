import React, { useReducer, createContext, useCallback } from 'react';
import axios from 'axios';
import {
  GET_CHARACTERS,
  GET_CHARACTER,
  ADD_CHARACTER,
  UPDATE_CHARACTER,
  DELETE_CHARACTER,
  CHARACTER_ERROR,
  CLEAR_CURRENT,
  SET_CURRENT,
  FILTER_CHARACTERS,
  CLEAR_FILTER,
  CLEAR_CHARACTERS
} from '../types';

const CharacterContext = createContext();

export const CharacterState = props => {
  const initialState = {
    characters: [],
    current: null,
    filtered: null,
    error: null,
    loading: true
  };

  const [state, dispatch] = useReducer(characterReducer, initialState);

  // Get Characters
  const getCharacters = useCallback(async () => {
    try {
      const res = await axios.get('/api/characters');
      dispatch({
        type: GET_CHARACTERS,
        payload: res.data
      });
    } catch (err) {
      dispatch({
        type: CHARACTER_ERROR,
        payload: err.response?.data?.error || 'Error fetching characters'
      });
    }
  }, []);

  // Get Single Character
  const getCharacter = async id => {
    try {
      const res = await axios.get(`/api/characters/${id}`);
      dispatch({
        type: GET_CHARACTER,
        payload: res.data
      });
    } catch (err) {
      dispatch({
        type: CHARACTER_ERROR,
        payload: err.response?.data?.error || 'Error fetching character'
      });
    }
  };

  // Add Character
  const addCharacter = async character => {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    try {
      const res = await axios.post('/api/characters', character, config);
      dispatch({
        type: ADD_CHARACTER,
        payload: res.data
      });
      return true;
    } catch (err) {
      dispatch({
        type: CHARACTER_ERROR,
        payload: err.response?.data?.error || 'Error adding character'
      });
      throw err;
    }
  };

  // Update Character
  const updateCharacter = async character => {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    try {
      const res = await axios.put(
        `/api/characters/${character._id}`,
        character,
        config
      );
      dispatch({
        type: UPDATE_CHARACTER,
        payload: res.data
      });
      return true;
    } catch (err) {
      dispatch({
        type: CHARACTER_ERROR,
        payload: err.response?.data?.error || 'Error updating character'
      });
      throw err;
    }
  };

  // Delete Character
  const deleteCharacter = async id => {
    try {
      await axios.delete(`/api/characters/${id}`);
      dispatch({
        type: DELETE_CHARACTER,
        payload: id
      });
    } catch (err) {
      dispatch({
        type: CHARACTER_ERROR,
        payload: err.response?.data?.error || 'Error deleting character'
      });
      throw err;
    }
  };

  // Clear Characters
  const clearCharacters = () => {
    dispatch({ type: CLEAR_CHARACTERS });
  };

  // Set Current Character
  const setCurrent = character => {
    dispatch({ type: SET_CURRENT, payload: character });
  };

  // Clear Current Character
  const clearCurrent = () => {
    dispatch({ type: CLEAR_CURRENT });
  };

  // Filter Characters
  const filterCharacters = text => {
    dispatch({ type: FILTER_CHARACTERS, payload: text });
  };

  // Clear Filter
  const clearFilter = () => {
    dispatch({ type: CLEAR_FILTER });
  };

  return (
    <CharacterContext.Provider
      value={{
        characters: state.characters,
        current: state.current,
        filtered: state.filtered,
        error: state.error,
        loading: state.loading,
        getCharacters,
        getCharacter,
        addCharacter,
        updateCharacter,
        deleteCharacter,
        clearCharacters,
        setCurrent,
        clearCurrent,
        filterCharacters,
        clearFilter
      }}
    >
      {props.children}
    </CharacterContext.Provider>
  );
};

// Reducer
const characterReducer = (state, action) => {
  switch (action.type) {
    case GET_CHARACTERS:
      return {
        ...state,
        characters: action.payload,
        loading: false
      };
    case GET_CHARACTER:
      return {
        ...state,
        current: action.payload,
        loading: false
      };
    case ADD_CHARACTER:
      return {
        ...state,
        characters: [action.payload, ...state.characters],
        loading: false
      };
    case UPDATE_CHARACTER:
      return {
        ...state,
        characters: state.characters.map(character =>
          character._id === action.payload._id ? action.payload : character
        ),
        loading: false
      };
    case DELETE_CHARACTER:
      return {
        ...state,
        characters: state.characters.filter(
          character => character._id !== action.payload
        ),
        loading: false
      };
    case CLEAR_CHARACTERS:
      return {
        ...state,
        characters: [],
        filtered: null,
        error: null,
        current: null
      };
    case SET_CURRENT:
      return {
        ...state,
        current: action.payload
      };
    case CLEAR_CURRENT:
      return {
        ...state,
        current: null
      };
    case FILTER_CHARACTERS:
      return {
        ...state,
        filtered: state.characters.filter(character => {
          const regex = new RegExp(`${action.payload}`, 'gi');
          return (
            character.name.match(regex) ||
            character.anime.match(regex) ||
            (character.abilities &&
              character.abilities.some(ability => ability.match(regex)))
          );
        })
      };
    case CLEAR_FILTER:
      return {
        ...state,
        filtered: null
      };
    case CHARACTER_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false
      };
    default:
      return state;
  }
};

export default CharacterContext;
