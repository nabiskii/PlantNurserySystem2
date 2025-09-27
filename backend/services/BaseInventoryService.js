class BaseInventoryService {
    constructor(model) {
        if (!model) {
            throw new Error('Model is required');
        }
        this.model = model;
    }

    // Methods to override in child classes (only if needed)
    async authorize (ctx) {
        return true;
    }

    async validate (data) {
        return data;
    }

    async filter (data) {
        return data || {};
    }

    async updateMask (data) {
        return data;
    }

    async formatOutput (data) {
        return data;
    }

    // CRUD methods

    _ctx(op, user) {
        return {op, user};
    }

    async create (data, {user} = {}) {
        await this.authorize(this._ctx('create', user));
        const clean = await this.validate(data, this._ctx('create', user));
        const doc = await this.model.create(clean);
        const out = doc.toObject ? doc.toObject() : doc;
        return this.formatOutput(out, this._ctx('create', user));
    }

    async findAll (options = {}, {user} = {}) {
        await this.authorize(this._ctx('findAll', user));
        const { query, select, populate, sort, limit, skip } = options;
        const filter = await this.filter(query || {}, this._ctx('findAll', user));
        
        let q = this.model.find(filter).lean();
        if (select) {
            q = q.select(select);
        }
        if (populate) {
            q = q.populate(populate);
        }
        if (sort) {
            q = q.sort(sort);
        }
        if (limit) {
            q = q.limit(limit);
        }

        const rows = await q.exec();
        return this.formatOutput(rows, this._ctx('findAll', user));
    }

    async findById (id, {user, options = {}} = {}) {
        await this.authorize(this._ctx('findById', user));
        let row = await this.model.findById(id).lean();
        const {select, populate} = options;
        if (select) {
            q = q.select(select);
        }
        if (populate) {
            q = q.populate(populate);
        }
        row = await q.lean();

        if (!row) {
            const e = new Error('Not Found');
            e.status= 404;
            throw e;
        }
        return this.formatOutput(row, this._ctx('findById', user));
    }

    async update (id, data) {
        await this.authorize(this._ctx('update', user));
        const clean = await this.validate(data, this._ctx('update', user));
        const masked = await this.updateMask(clean, this._ctx('update', user));

        const row = await this.model.findByIdAndUpdate(id, masked, {new: true, runValidators:true}).lean();
        if (!row) {
            const e = new Error('Not Found');
            e.status= 404;
            throw e;
        }
        return this.formatOutput(row, this._ctx('update', user));
    }

    async delete (id, {user} = {}) {
        await this.authorize(this._ctx('delete', user));
        const row = await this.model.findByIdAndDelete(id).lean();
        if (!row) {
            const e = new Error('Not Found');
            e.status= 404;
            throw e;
        }
        return this.formatOutput(row, this._ctx('delete', user));
    }
}

module.exports = BaseInventoryService;