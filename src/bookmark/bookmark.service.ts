import { ForbiddenException, HttpCode, HttpStatus, Injectable } from '@nestjs/common';
import { CreateBookmarkDto, EditBookmarkDto } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class BookmarkService {
    
        constructor(private prisma: PrismaService){}

        getBookmarks(userId: number){
           return this.prisma.bookmark.findMany({
                where: {
                    userId,
                }
            })
        }
    
        async createBookmark(userId: number, dto:CreateBookmarkDto){
           const bookmark = await this.prisma.bookmark.create({
            data: {
                userId,
                ...dto
            },
           })
           return bookmark;
        }
    
        getBookmarkById(userId: number, bookmarkId: number){
            return this.prisma.bookmark.findFirst({
                where: {
                    id: bookmarkId,
                    userId,
                }
            });
        }
    
        async editBookmarkById(userId: number, bookmarkId: number, dto:EditBookmarkDto){
            //get the bookmark by Id
            const bookmark = await this.prisma.bookmark.findUnique({
                where: {
                    id: bookmarkId
                }
            })
            //check if the user owns the bookmark
            if(!bookmark || bookmark.userId !== userId){
                throw new ForbiddenException("Acess to ressources Denied")
            }
            //modify the bookmark
            return this.prisma.bookmark.update({
                where : {
                    id: bookmarkId
                },
                data: {
                    ...dto
                }
            })
        }
        async deleteBookmarkById(userId: number, bookmarkId:number){
            //get the bookmark by Id
            const bookmark = await this.prisma.bookmark.findUnique({
                where: {
                    id: bookmarkId
                }
            })
            //check if the user owns the bookmark
            if(!bookmark || bookmark.userId !== userId){
                throw new ForbiddenException("Acess to ressources Denied")
            }
            await this.prisma.bookmark.delete({
                where: {
                    id: bookmarkId
                }
            })
        }
}
