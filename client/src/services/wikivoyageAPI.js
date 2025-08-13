import axios from 'axios';

const WIKIVOYAGE_API_URL = 'https://en.wikivoyage.org/api.php';

export const wikivoyageAPI = {
  // Search for travel articles about a place
  searchPlace: async (placeName) => {
    try {
      const response = await axios.get(WIKIVOYAGE_API_URL, {
        params: {
          action: 'query',
          format: 'json',
          list: 'search',
          srsearch: `${placeName} travel`,
          srlimit: 10,
          origin: '*'
        }
      });

      return response.data.query.search;
    } catch (error) {
      console.error('Wikivoyage Search Error:', error);
      throw new Error('Failed to search Wikivoyage');
    }
  },

  // Get travel tips and recommendations
  getTravelTips: async (placeName) => {
    try {
      const response = await axios.get(WIKIVOYAGE_API_URL, {
        params: {
          action: 'query',
          format: 'json',
          list: 'search',
          srsearch: `${placeName} travel tips recommendations`,
          srlimit: 3,
          origin: '*'
        }
      });

      return response.data.query.search;
    } catch (error) {
      console.error('Wikivoyage Travel Tips Error:', error);
      return [];
    }
  },

  // Get detailed content of a specific page
  getPageContent: async (pageId) => {
    try {
      const response = await axios.get(WIKIVOYAGE_API_URL, {
        params: {
          action: 'query',
          format: 'json',
          prop: 'extracts',
          pageids: pageId,
          exintro: 1,
          explaintext: 1,
          exsectionformat: 'plain',
          origin: '*'
        }
      });

      const pages = response.data.query.pages;
      const page = pages[pageId];
      
      if (page && page.extract) {
        return {
          title: page.title,
          content: page.extract,
          pageid: page.pageid
        };
      }
      
      return null;
    } catch (error) {
      console.error('Wikivoyage Content Error:', error);
      throw new Error('Failed to fetch page content');
    }
  },

  // Get travel guide sections for a place
  getTravelGuide: async (placeName) => {
    try {
      // First search for the place
      const searchResults = await this.searchPlace(placeName);
      
      if (searchResults.length === 0) {
        return null;
      }

      // Get content for the first result
      const firstResult = searchResults[0];
      const content = await this.getPageContent(firstResult.pageid);
      
      return {
        searchResults,
        mainContent: content
      };
    } catch (error) {
      console.error('Wikivoyage Travel Guide Error:', error);
      throw new Error('Failed to fetch travel guide');
    }
  },

  // Get specific sections like "Get in", "See", "Do", "Eat", "Sleep"
  getSectionContent: async (pageId, sectionTitle) => {
    try {
      const response = await axios.get(WIKIVOYAGE_API_URL, {
        params: {
          action: 'parse',
          format: 'json',
          pageid: pageId,
          section: sectionTitle,
          prop: 'text',
          origin: '*'
        }
      });

      return response.data.parse.text['*'];
    } catch (error) {
      console.error('Wikivoyage Section Error:', error);
      return null;
    }
  },

  // Get images for a place
  getImages: async (pageId) => {
    try {
      const response = await axios.get(WIKIVOYAGE_API_URL, {
        params: {
          action: 'query',
          format: 'json',
          prop: 'images',
          pageids: pageId,
          imlimit: 10,
          origin: '*'
        }
      });

      const pages = response.data.query.pages;
      const page = pages[pageId];
      
      return page.images || [];
    } catch (error) {
      console.error('Wikivoyage Images Error:', error);
      return [];
    }
  }
};
