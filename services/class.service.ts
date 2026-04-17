import api from '@/lib/axios';
import { ENDPOINTS } from '@/constants/api';
import type { Class, ClassMember, Announcement } from '@/types/class';

export const classService = {
  getAll:             ()                                                      => api.get<Class[]>(ENDPOINTS.CLASSES.BASE),
  getJoined:          ()                                                      => api.get<Class[]>(ENDPOINTS.CLASSES.JOINED),
  create:             (data: { name: string })                                => api.post<Class>(ENDPOINTS.CLASSES.BASE, data),
  getById:            (id: number)                                            => api.get<Class>(ENDPOINTS.CLASSES.BY_ID(id)),
  remove:             (id: number)                                            => api.delete(ENDPOINTS.CLASSES.BY_ID(id)),
  getMembers:         (id: number)                                            => api.get<ClassMember[]>(ENDPOINTS.CLASSES.MEMBERS(id)),
  removeMember:       (id: number, sid: number)                               => api.delete(ENDPOINTS.CLASSES.MEMBER(id, sid)),
  join:               (data: { class_code: string })                          => api.post(ENDPOINTS.CLASSES.JOIN, data),
  getAnnouncements:   (id: number)                                            => api.get<Announcement[]>(ENDPOINTS.CLASSES.ANNOUNCEMENTS(id)),
  createAnnouncement: (id: number, data: { title: string; content: string }) => api.post<Announcement>(ENDPOINTS.CLASSES.ANNOUNCEMENTS(id), data),
};