-- AlterTable
ALTER TABLE "public"."projects" ADD COLUMN     "renderPath" TEXT;

-- AlterTable
ALTER TABLE "public"."videos" ADD COLUMN     "renderPath" TEXT,
ADD COLUMN     "voiceId" TEXT;
