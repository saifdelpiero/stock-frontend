// Stock Management Services

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

class StockService {
  // Get all stocks
  static async getAllStocks() {
    try {
      const response = await fetch(`${API_BASE_URL}/stocks`);
      if (!response.ok) throw new Error('Failed to fetch stocks');
      return await response.json();
    } catch (error) {
      console.error('Error fetching stocks:', error);
      throw error;
    }
  }

  // Get stock by ID
  static async getStockById(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/stocks/${id}`);
      if (!response.ok) throw new Error('Stock not found');
      return await response.json();
    } catch (error) {
      console.error('Error fetching stock:', error);
      throw error;
    }
  }

  // Create new stock
  static async createStock(stockData) {
    try {
      const response = await fetch(`${API_BASE_URL}/stocks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(stockData)
      });
      if (!response.ok) throw new Error('Failed to create stock');
      return await response.json();
    } catch (error) {
      console.error('Error creating stock:', error);
      throw error;
    }
  }

  // Update stock
  static async updateStock(id, stockData) {
    try {
      const response = await fetch(`${API_BASE_URL}/stocks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(stockData)
      });
      if (!response.ok) throw new Error('Failed to update stock');
      return await response.json();
    } catch (error) {
      console.error('Error updating stock:', error);
      throw error;
    }
  }

  // Delete stock
  static async deleteStock(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/stocks/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Failed to delete stock');
      return await response.json();
    } catch (error) {
      console.error('Error deleting stock:', error);
      throw error;
    }
  }

  // Search stocks
  static async searchStocks(query) {
    try {
      const response = await fetch(`${API_BASE_URL}/stocks/search?q=${encodeURIComponent(query)}`);
      if (!response.ok) throw new Error('Search failed');
      return await response.json();
    } catch (error) {
      console.error('Error searching stocks:', error);
      throw error;
    }
  }

  // Get stock by symbol
  static async getStockBySymbol(symbol) {
    try {
      const response = await fetch(`${API_BASE_URL}/stocks/symbol/${symbol}`);
      if (!response.ok) throw new Error('Stock symbol not found');
      return await response.json();
    } catch (error) {
      console.error('Error fetching stock by symbol:', error);
      throw error;
    }
  }
}

export default StockService;
