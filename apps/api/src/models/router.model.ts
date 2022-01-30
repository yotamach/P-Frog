import { Router } from "express";

export interface AppRouter{
    url: string;
    router: Router;
}
