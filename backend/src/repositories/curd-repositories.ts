import { Document, Model } from 'mongoose'

export class curdRepository<T extends Document> {
  constructor(public model: Model<T>) {}

  async create(data: Partial<T>): Promise<T> {
    return this.model.create(data)
  }

  async findById(id: string): Promise<T | null> {
    return this.model.findById(id)
  }

  async findAll(): Promise<T[] | []> {
    return this.model.find()
  }

  async update(id: string, data: Partial<T>): Promise<T | null> {
    return this.model.findByIdAndUpdate({
      id,
      data,
    })
  }

  async delete(id: string): Promise<T | null> {
    return this.model.findByIdAndDelete(id)
  }

  async deleteMany(id: string) {
    return this.model.deleteMany({ workspaceId: id })
  }
}
