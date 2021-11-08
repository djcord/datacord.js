const axios = require('axios');
class Datacord {
  options: any;
  noDuplicate: any;
  version: String;
  databaseURI: string;
  autoOverride: any;
  constructor(options) {
    if(typeof options != 'string' && typeof options?.token != 'string')throw new Error('Please provide a token');
    if(options?.noDuplicate && typeof options?.noDuplicate != 'boolean')throw new Error('option:noDuplicate must be a boolean'); 
    if(options?.autoOverride && typeof options?.autoOverride != 'boolean')throw new Error('option:autoOverride must be a boolean');
     this.options = options;
     this.noDuplicate = options?.noDuplicate ? options?.noDuplicate : false;
     this.autoOverride = options?.autoOverride ? options?.autoOverride : false;
     this.version = `${options?.version ? options?.version : "v1"}`;
     this.databaseURI = `https://datacord.js.org/${this?.version}/${typeof options == 'string' ? options : options?.token}`
  }
  check(item) {
    if(item.length > 10) throw new Error('Item Length Exceeded 10 Characters');
    if(typeof item != 'string' && typeof item?.tag != 'string')throw new Error('Invalid Tag Name');
  }
  addPostOption(){
    return `${this.noDuplicate ? `noDuplicate=true&` : ''}${this.autoOverride ? `autoOverride=true&` : ''}`
  }
  async get(item:any) {
    this.check(item);
    try{
    const data = (await axios.get(`${this.databaseURI}?tag=${typeof item == 'string' ? item : item?.tag}`)).data;
    return data;
    }catch(e) {
        throw new Error(`APIError: ${e.message}`)
    }
  } 
  async delete(item){
    this.check(item);
    try{
    const response = (await axios.delete(`${this.databaseURI}${item ? `?tag=${typeof item == 'string' ? item : item.tag}` : ''}`));
    if(response.status != 200)throw new Error(`APIError: ${response?.data?.message}`);
    return response.data;
    }catch(e) {
        throw new Error(`${e}`)
    }
  }
  async save(item:any) {
    if(typeof item != 'object')throw new Error('Save Option Must Be An Object');
    if(!item.tag)throw new Error('Item Tag Is Undefined');
    if(!item.value)throw new Error('Item Value Is Undefined');
    try {
     const data = (await axios.post(`${this.databaseURI}/?${this.addPostOption()}`, item)).data;
     return data;
   }catch(e) {
      throw new Error(`APIError: ${e.message}`);
    }
  }
  async list() {
   try{
    const data = (await axios.get(`${this.databaseURI}`)).data;
    return data || {};
   }catch(e) {
     throw new Error(`APIError: ${e.message}`)
   }
  }
}

module.exports = Datacord;
