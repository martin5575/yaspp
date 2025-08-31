import axios from "axios";

class DataService {
  async getMatchDay(league, year, matchDay) {
    return await axios.get(
      `/api/getmatchdata/${league}/${year}/${matchDay}`
    );
  }
}

export default DataService;
