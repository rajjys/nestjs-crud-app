import { Test } from "@nestjs/testing";
import { AppModule } from "../src/app.module";
import { INestApplication, ValidationPipe } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import * as pactum from "pactum";
import { AuthDto, EditUserDto } from "src/auth/dto";
import { CreateBookmarkDto, EditBookmarkDto } from "src/bookmark/dto";

describe('App e2e', ()=>{
  let app: INestApplication;
  let prisma: PrismaService;
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule(
      {
        imports: [AppModule],
      }).compile();
app = moduleRef.createNestApplication();
app.useGlobalPipes(new ValidationPipe({whitelist: true}));
pactum.request.setBaseUrl('http://localhost:3333');
await app.init();
await app.listen(3333);
  });
  
  afterAll(async () => {
    await app.close();
    prisma = app.get(PrismaService);
    await prisma.cleanDb()
  });

  describe('Auth', () => {
     const dto: AuthDto = {
          email: 'jonathan@gmail.com',
          password: "1234",
        }
    describe('Signup', () => {
      it('should throw if email empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            password: dto.password,
          })
          .expectStatus(400)
        })
      it('should throw if password empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            email: dto.email,
          })
          .expectStatus(400)
        })
      it('should throw if no body', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .expectStatus(400)
        })
      it('should signUp', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody(dto)
          .expectStatus(201)
    })
    describe('Signin', () => {
      it('should throw if email empty', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({
            password: dto.password,
          })
          .expectStatus(400)
        })
      it('should throw if password empty', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({
            email: dto.email,
          })
          .expectStatus(400)
        })
      it('should throw if no body', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .expectStatus(400)
        })
      it('should throw if wrong credentials', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({
            email: dto.email,
            password: 'wrongpassword',
          })
          .expectStatus(403)
        })
      it('should signIn', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody(dto)
          .expectStatus(200)
          .stores('userAt', 'access_token')
      });

    })
  })

  describe('Users', () => {
    describe('Get Me', () => {
      it('should get current user', () => {
        return pactum
          .spec()
          .get('/users/me')
          .expectStatus(200)
          .withHeaders({
            Authorization: `Bearer $S{userAt}`
          })
      });
    });
  });
  describe('Edit User', () => {
    it('should edit user', () => {
      const dto: EditUserDto = {
        firstName: 'Jonathan',
        email: 'john@gmail.com',
      }
      return pactum
        .spec()
        .patch('/users')
        .withHeaders({
          Authorization: `Bearer $S{userAt}`
        })
        .withBody(dto)
        .expectStatus(200)
        .expectBodyContains(dto.firstName)
        .expectBodyContains(dto.email)
        .stores('userId', 'id');
    });
  });
    describe('Bookmarks', () => {
    it('should return Empty Array', () => {
        return pactum
        .spec()
        .get('/bookmarks')
        .withHeaders({
          Authorization: `Bearer $S{userAt}`
        })
        .expectStatus(200)
        .expectBody([]);
      })
    it('should create a Bookmark', () => {
        const dto: CreateBookmarkDto = {
          title: "Bookmark 1",
          link: "host/bookmark-1",
          description: "First Bookmark"
        }
        return pactum
          .spec()
          .post("/bookmarks")
          .withHeaders({
            Authorization: `Bearer $S{userAt}`
          })
          .withBody(dto)
          .expectStatus(201)
          .expectBodyContains(dto.title)
          .expectBodyContains(dto.link)
          .expectBodyContains(dto.description)
          .stores('bookmarkId', 'id');
      })
    it('should return Array of 1', () => {
        return pactum
          .spec()
          .get('/bookmarks')
          .withHeaders({
            Authorization: `Bearer $S{userAt}`
          })
          .expectStatus(200)
          .expectJsonLength(1) 
      })
    it('should get bookmark by id', () => {
        return pactum
          .spec()
          .get('/bookmarks/{id}')
          .withPathParams('id', '$S{bookmarkId}')
          .withHeaders({
            Authorization: `Bearer $S{userAt}`
          })
          .expectStatus(200)
          .expectBodyContains('$S{bookmarkId}');
      })
    it('should edit bookmark by id', () => {
        const dto : EditBookmarkDto = {
          title: "Updated Bookmark",
          description: "The bookmark has been updated",
        }
        return pactum
          .spec()
          .patch('/bookmarks/{id}')
          .withPathParams('id', '$S{bookmarkId}')
          .withHeaders({
            Authorization : `Bearer $S{userAt}`
          })
          .withBody(dto)
          .expectStatus(200)
          .expectBodyContains(dto.title)
          .expectBodyContains(dto.description)
      })
    it('should delte a bookmark by id',() => {
        return pactum
          .spec()
          .delete('/bookmarks/{id}')
          .withPathParams('id', '$S{bookmarkId}')
          .withHeaders({
            Authorization : `Bearer $S{userAt}`
          })
          .expectStatus(204)
      })
    it('should return Empty Array', () => {
        return pactum
        .spec()
        .get('/bookmarks')
        .withHeaders({
          Authorization: `Bearer $S{userAt}`
        })
        .expectStatus(200)
        .expectBody([]);
      })
    }) 
  })
})