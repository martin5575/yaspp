import axios from "axios";

class DataService {
  async getMatchDay(league, year, matchDay) {
    return await axios.get(
      `https://www.openligadb.de/api/getmatchdata/${league}/${year}/${matchDay}`
    );
  }
}

export default DataService;
