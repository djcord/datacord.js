const Client = require('./../index');
    
class Model extends Client {
    constructor(name, options) {
     super(options);
     this.autoOverride = true;
     if(typeof name != 'string')throw new Error('Model name must be a string');
     this.name = name;
     this.schema = {};
    }
    
    Schema(obj) { 
       if(typeof obj != 'object')throw new Error('Please provide a valid object');
       this.schema = obj;
       return this.schema;
    }
    
    async verify(obj) {
        for (const i in this.schema) {
            var d = this.schema[i];
            if(typeof d != 'function')throw new Error('Schema data type must be a function');
        } 
        if(obj) {
            for(const e in obj) {
            if(!this.schema[e]) throw new Error(`${e} does not exist on the schema model`);
            if(this.schema[e]?.name?.toLowerCase() == 'array' && !Array.isArray(obj[e]))throw new Error(`Type of ${e} must be an array`)
            if(this.schema[e]?.name?.toLowerCase() != 'array' && typeof obj[e] != this.schema[e]?.name?.toLowerCase()) throw new Error(`Type of ${e} must be ${this?.schema[e]?.name?.toLowerCase()}`)
            }
        }
    }

    async add(obj) {
    var data;
    this.verify(obj);
    try {
     data = (await this.get(`model-${this.name}`));
    }catch(e) {}
    if(!data) {
    return await this.save({
       tag: `model-${this.name}`,
       value: `${JSON.stringify([obj])}`
     });
    }else {
    return await this.save({
      tag: `model-${this.name}`,
      value: `${JSON.stringify(data.data.concat([obj]))}`
    });
    }
    }

    async remove(object) {
        try {
      const data = (await this.get(`model-${this.name}`)).data;
      if(typeof object != 'object')throw new Error('Remove option must be an object');
      for(const i in object) {
       return await this.save({
           tag: `model-${this.name}`,
           value: `${JSON.stringify(data.filter(obj => obj[i] !== object[i]))}`
      });
    }
        }catch(e) {
      throw new Error('This model does not exist');
        }
    }
    
    async list() {
    try {
     const data = (await this.get(`model-${this.name}`)).data;
     return data;
    }catch(e) {
        throw new Error('This model does not exist');
    }
    }

    async find(object) {
      try {
      const data = (await this.get(`model-${this.name}`)).data;
      if(typeof object != 'object')throw new Error('Find option must be an object');
      for(const i in object) {
      return data.filter(obj => obj[i] == object[i]);
      }
      }catch(e) {
          throw new Error('This model does not exist');
      }
    }    
}

module.exports = Model;
