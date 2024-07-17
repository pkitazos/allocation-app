# Export matching details plan

1. setup mutations that will hit external endpoints

   - create button that when clicked will call this trpc mutation
   - the mutation will use axios to call the endpoint
   - we will create a zod schema to validate the response
   - we can then use the response to update our db if necessary (i.e when creating projects)

2. build export page

   - create a view of the data that will be exported (this could be a data table)
   - create a trpc query that computes and formats the relevant matching data to be exported
   - create a button that when clicked will format + download said data as a csv
