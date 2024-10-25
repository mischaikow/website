## website

Current iteration of mischaikow.com

## Todo

- **Automate Certbot** I followed [this blog post](https://mindsers.blog/en/post/https-using-nginx-certbot-docker/) to set up my Certbot, but haven't yet set up the cron job to auto-refresh the certs. For now, at least, I can just run `docker-compose run --rm certbot renew` from the `nginx` directory...
- **Get S3 Bucket set up** My resume lives in the EC2 instance, but maybe it should be in S3?
- **Get PostgreSQL database set up** Most projects of interest require some kind of relational database, which means getting it connected to EC2.
- **Refine this site's CI/CD pipeline with AWS** The script that gets the docker containers up and running seems to work, but I don't have much confidence in it
- **Improve GitHub Actions <> AWS integration** Every time GitHub Actions builds the site it runs a raw script, but this script doesn't interface with GitHub Actions at all which means it's difficult to interpret the results accurately
