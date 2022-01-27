import { Request, Response } from 'express';

export default class Handler {
  /**
   * @param {object} ctx
   * @param {req} ctx.request
   * @param {res} ctx.response
   * @param {mesage} string error
   * @param {status} HttpCode status
   */
  static errorHandler(req: Request, res: Response, message: string, status: number) {
    return res.status(status || 400).json({
      message,
      status,
    });
  }

  /**
   * @param {object} ctx
   * @param {req} ctx.request
   * @param {res} ctx.response
   * @param {data} ctx.data response data
   * @param {status} HttpCode status
   */
  static successHandler(req: Request, res: Response, data: any, status: number) {
    return res.status(status || 200).json(data);
  }
}

