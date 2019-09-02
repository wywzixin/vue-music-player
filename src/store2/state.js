import { loadSearch } from 'assets/js/cache'
const state = {
    disc : {} ,  //推荐页详情信息
    topList: {},
    searchHistory: loadSearch()
}
export default state