## A few points to keep in mind to follow this modular monolithic architecture 
- A module imports only from platform/* and from other modules’ index.ts.
- platform/* never imports from modules/*.
- Only app.ts knows about every module.
- A module never reads another module’s database tables.
- Business rules live in services, SQL lives in repositories, HTTP concerns live in routes.
- Money is always an integer in the smallest unit, plus a currency code.