import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

export const searchAdilet = async (query: string) => {
  try {
    const response = await axios.get(`${API_URL}/search`, {
      params: { q: query }
    });
    return response.data;
  } catch (error) {
    console.error('Search API Error:', error);
    throw error;
  }
};

export const fetchDocument = async (url: string) => {
  try {
    const response = await axios.get(`${API_URL}/document`, {
      params: { url }
    });
    return response.data;
  } catch (error) {
    console.error('Document API Error:', error);
    throw error;
  }
};