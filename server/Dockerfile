FROM node:22.14.0-alpine
# Install production dependecies into container
WORKDIR /app
COPY package.json /app
RUN npm install --production
# Set Up Supabase Postgre database
COPY . /app
ENV DB_URL="postgresql://postgres.jfjrwguqphslcaylpcjk:LgH565N&pensd3@aws-0-eu-west-2.pooler.supabase.com:6543/postgres"
RUN npm run setup-db
# Run the Server
ENV PORT=3000
ENV BCRYPT_SALT_ROUNDS=12
ENV SECRET_TOKEN="xPjptDSorNULFvdHK5ilBEpYZlWF9FtK"
EXPOSE 3000
CMD npm start