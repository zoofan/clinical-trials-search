## Run the application locally 

First, install the dependencies:

```bash
npm install
# or
yarn
# or
pnpm install
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## A few points 
- The text search traverses through ALL the fields of the JSON when searching for studies through the user's keyword search. So if a user searches for 'NSCLC' and that term is not in the title but in the 'Conditions' field, that study will show up in the search. I think this is a better approach for Sarah's usecase. 

  NOTE: This is obviously not scalable for larger datasets. In an actual real world application, I'd use a tool like Elasticsearch. 
- I gave Sarah the option of filtering only for completed trials. I don't think she would be interested in terminatedd or recruiting trials. 
- If I had more time, I'd create a quick scoring system to order the generated results by relevancy. 
- I would also definitely implement pagination if I had more time. 
- Currently, I'm only showing the top 30 search results. 
## Demo
The app is deployed and you can play it around with it here: https://mohsen-zoofan-argon-tech-screen.vercel.app/

## Bonus question answers 
*NSCLC has many different representations in the dataset. For example, it could be “non
small cell lung cancer”, “non small cell lung carcinoma”, “NSCLC”, “carcinoma of the
lungs, non small cell”, etc. How do we capture all the relevant clinical trials for searches
on any disease?*

>We had a very similiar use case at Emissary.io, where we had to implement a search for all accounts. We had the make sure a search for BOA returned 'Bank of America' or 'Facebook' returned 'Meta'. We used Elasticsearch, which supports full-text search, fuzzy matching, and synonym handling out-of-the-box.

>In our case, we created a tool for admins to manually enter any sysnonyms that came up. A more scalable approach would be to leverage existing thesauri (in your case possibly Unified Medical Language System) and use their API to add integrate the sysnonms. In conjusction with a tool like ElasticSearch, this would give**


*How do we allow her to search for NSCLC trials -AND- immunotherapy related drugs?*

> To allow for compound searching, I'd add more text search fields, such as "Drug:____" and "Condition:____" and then search only in the appropriate fields of the data set. This would also make weighing relevancy more powerful and present thee most relevant trials first. 

*How would you deploy your software?* 
>I deployed using vercel, can be found here: https://mohsen-zoofan-argon-tech-screen.vercel.app


*What are the alternatives to loading the dataset into memory, and why would you want to
use those alternatives?* 
>Loading in memory is obviously not scalable. I'd use a database with powerful searching capabilities such as Elasticsearch. This would make it easier and faster to perform text searches with relevancy scoring, combine multiple conditions (using AND, NOT, and OR operatiors), and perform 'fuzzy' queries (handle misspellings and approximate matches).

*How do we evaluate completeness of results?*
> I'd do both manual spot checking and writing some automated tests. We'd have to create a manually curated list of trials known to match certain criteria and search against that. I test for both recall (ratio of relevant documents retrieved to the total number of relevant documents in the dataset) and precision (the proportion of retrieved trials that are relevant).