import { request } from "http";

request.arguments();

describe('Simple test',() => {
    it('Should return true', () => {
        //request('settings/')
        expect(true).toBe(true);
    });
});