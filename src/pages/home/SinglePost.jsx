import { Container, Typography, Grid, Card, CardContent, Box } from "@mui/material";

import PostTagsAndShare from '../../components/display/free/PostTagsAndShare'; // Các nút điều hướng mạng xã hội: VD facebook, twitter, linkedin, youtube
import InstagramGallery from "../../components/display/GroupItems/InstagramGallery";
import LatestPosts from "../../components/display/post/LatestPosts";
import BreadcrumbsComponent from '../../components/display/free/BreadcrumbsComponent'; // Component Breadcrumbs


const SinglePost = () => {
  return (
    <>
      <BreadcrumbsComponent
        title="Post"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Post" },
          { label: "Post" } // Không có href → là trang hiện tại
        ]} />
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <Card sx={{ boxShadow: "none" }}>
              <CardContent>
                <Box>
                  <Typography variant="body2" sx={{color: '#677d72' }}>
                    Feb 22, 2025 - <a href="/blog">Books</a>
                  </Typography>
                </Box>
                <Typography variant="h4" sx={{ my: 2 }}>
                  Must read books if you like reading Hector Malot.
                </Typography>
                <Box component="img" src="/demo/images/single-post.jpg" alt="single-post" width="100%" sx={{ my: 2 }} />
                <Typography variant="body1" paragraph>
                  When mentioning the famous writer Hector Malot, we all immediately think of the book
                  "No Family" - a book that has left a strong impression on readers about family
                  affection. Today, let's go deeper into the work with AnyBooks to better understand
                  the message of the book "No Family" that the author wants to convey!
                  A few words about the author of the book "No Family"

                </Typography>
                <blockquote>
                  <Typography variant="h6" fontStyle="italic">
                    “A few words about the author of the book "No Family"...
                  </Typography>
                </blockquote>
                <Typography variant="h5" sx={{ mt: 3 }}>
                  Is This Great?
                </Typography>
                <Grid container spacing={2} sx={{ mt: 2 }}>
                  <Grid item xs={12} sm={6}>
                    <ul>
                      <li>The author of the book "No Family" is Hector Malot</li>
                      <li>he is the author of many novels and at that time and is loved by readers all over the world</li>
                      <li>His literary career includes more than 70 works</li>
                    </ul>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <ul>
                      <li>which the book "No Family" published in 1878</li>
                      <li>the work that adds to his success</li>
                      <li>The work "No Family" was initially aimed at children</li>
                    </ul>
                  </Grid>
                </Grid>
                <Typography variant="body1" paragraph>
                  But adults went crazy about this work of his. In addition,
                  he also had many works that left their mark such as the book The Lovers -
                  the first work that created a fever or the work Romain Kalbris (1869),
                  In the family (En Famille, 1893).
                </Typography>
                {/* <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}> */}
                {/* <Box
                    component="img"
                    src="/demo/images/post-img.jpg"
                    alt="post-image"
                    sx={{
                      width: "40%", // Chiếm 40% chiều ngang
                      borderRadius: 2, // Bo góc
                    }}
                  /> */}
                {/* <Box sx={{ flex: 1 }}> */}

                <Box
                  component="img"
                  src="/demo/images/post-img.jpg"
                  alt="post-image"
                  sx={{
                    width: "40%", // Chiếm 40% chiều ngang
                    float: "left", // Đưa ảnh sang bên trái
                    mr: 2, // Margin-right để tạo khoảng cách với text
                    mb: 1, // Margin-bottom để không bị đè bởi text phía dưới
                    borderRadius: 2, // Bo góc ảnh nhẹ nhàng
                  }}
                />
                <Typography variant="h5" sx={{ mt: 3 }}>
                  He was praised by the world for his talent in writing books
                </Typography>
                <Typography variant="body1" paragraph sx={{ textAlign: "justify" }}>
                  His art was to leave behind philosophies that made adults ponder
                  in the historical context of France at that time and help them find a
                  new way to escape the confinement in their own depths.
                  The content of the work Without a Family tells about the special
                  fate of an orphan named Remi, who was raised by a family named Barberin
                  since childhood. However, not long after, due to the family's difficult
                  circumstances, this family sold him to a man named Vitalis - the owner of a traveling circus.
                  Since then, Remi's childhood has been associated with this
                  circus, where he made friends with animals raised in the circus
                  to perform such as monkeys, dogs and traveled around France with the
                  circus owner Vitalis to make a living. Thanks to the owner's teachings,
                  Remi learned a lot and gradually became a
                  brave boy who dared to face all the difficulties in life.
                  During his journey to make a living and wander everywhere
                  with the circus, the boy came into contact with all kinds of good
                  and bad people in society at that time and encountered many dangers.
                  However, thanks to the noble virtues that the owner Vitalis taught him,
                  he was able to stay calm and overcome those
                  challenges and continue to work hard with the circus.
                  Compared to his age, Remi had to face many difficult
                  situations, there were details that he was about to
                  starve and freeze to death or even unjustly imprisoned.
                  But after all, Remi still built himself a virtue, maintained his human qualities and never
                  surrendered to fate despite the chaos of society at that time.
                  Even when the circus owner Vitalis passed away and the circus
                  only had dogs to keep him company, he did not give up and continued
                  to work and dedicate himself, making the reader feel admiration for the
                  spirit and qualities of this boy at such a young age.
                  At the end of the work, after being imprisoned in England,
                  Remi finally found his own happiness, which was finding his lost
                  mother after so many years apart. This was also the reward for the
                  boy who had suffered so much, reading this far,
                  many audiences were happy and moved by this character.
                  The meaningful message that the book wants to convey

                  It can be said that the work "No Family" has brought readers
                  to experience the journey of the boy Remi to make a living with many
                  ironic situations that a boy who is too young has to endure and overcome.
                  There were times when it seemed like the end was near, but the boy was still
                  optimistic to overcome, gaining more valuable
                  experiences that other children of the same age do not have.
                </Typography>
                {/* </Box>
                </Box> */}

              </CardContent>
            </Card>
          </Grid>
        </Grid>
        <PostTagsAndShare />

      </Container>

      <LatestPosts />
      <InstagramGallery />
    </>
  );
};

export default SinglePost;
