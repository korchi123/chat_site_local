import ApiError from '../error/ApiError.js';
import profileService from '../service/profileService.js';
import { promises as fs } from 'fs';

class ProfileController {
    async getProfile(req, res, next) {
        try {
            const userId = req.user.id;
            const profile = await profileService.getProfile(userId);
            return res.json({
                birthDate: profile.birthDate,
                bio: profile.bio,
                photo: profile.photo
            });
        } catch (e) {
            next(e);
        }
    }

    async updateBio(req, res, next) {
        try {
            const userId = req.user.id;
            const { bio } = req.body;
            const profile = await profileService.updateProfile(userId, { bio });
            return res.json(profile);
        } catch (e) {
            next(e);
        }
    }

    async updateBirthDate(req, res, next) {
        try {
            const userId = req.user.id;
            const { birthDate } = req.body;
            const profile = await profileService.updateProfile(userId, { birthDate });
            return res.json(profile);
        } catch (e) {
            next(e);
        }
    }

    async uploadPhoto(req, res, next) {
        try {
            if (!req.file) {
                throw ApiError.BadRequest('Файл не был загружен');
            }
            
            const result = await profileService.uploadPhoto(req.user.id, req.file);
            
            return res.json(result);
        } catch (error) {
            // Удаляем временный файл в случае ошибки
            if (req.file?.path) {
                await fs.unlink(req.file.path).catch(console.error);
            }
            next(error);
        }
}
    async deletePhoto(req, res, next) {
        try {
            const userId = req.user.id;
            const result = await profileService.deletePhoto(userId);
            return res.json(result);
        } catch (e) {
            next(e);
        }
    }
    async getUserProfile(req, res, next) {
        try {
            const userId = req.params.userId;
            
            // Проверяем, что userId является числом
            if (!userId || isNaN(parseInt(userId))) {
            return res.status(400).json({ message: 'Неверный идентификатор пользователя' });
            }
            
            const profile = await profileService.getUserProfile(userId);
            return res.json(profile);
        } catch (e) {
            next(e);
        }
        }
}

export default new ProfileController();