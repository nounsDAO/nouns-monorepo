import { ImageData as data, getVrbData } from '@vrbs/assets';
import { useAppSelector } from '../../hooks';
import fomo from '../../assets/fomo.svg';
import { buildSVG } from '@vrbs/sdk';
import { BigNumber, BigNumber as EthersBN } from 'ethers';
import { IVrbSeed, useVrbSeed } from '../../wrappers/vrbsToken';
import Vrb from '../Vrb';
import { Link } from 'react-router-dom';
import classes from './StandaloneVrb.module.css';
import { useDispatch } from 'react-redux';
import { setOnDisplayAuctionVrbId } from '../../state/slices/onDisplayAuction';
import vrbClasses from '../Vrb/Vrb.module.css';
import Image from 'react-bootstrap/Image';
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Pagination } from "swiper";
import "swiper/swiper.css";
import "swiper/modules/effect-coverflow/effect-coverflow.min.css";
import "swiper/modules/pagination/pagination.min.css";

interface StandaloneVrbProps {
  vrbId: EthersBN;
}
interface StandaloneCircularVrbProps {
  vrbId: EthersBN;
  border?: boolean;
}

interface StandaloneVrbWithSeedProps {
  vrbId: EthersBN;
  onLoadSeed?: (seed: IVrbSeed) => void;
  shouldLinkToProfile: boolean;
}

export const getVrb = (vrbId: string | EthersBN, seed: IVrbSeed) => {
  const id = vrbId.toString();
  const name = `Vrb ${id}`;
  const description = `Vrb ${id} is a member of the Vrbs DAO`;
  const { parts, background } = getVrbData(seed);
  const image = `data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjMyMCIgdmlld0JveD0iMCAwIDMyMCAzMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc2hhcGUtcmVuZGVyaW5nPSJjcmlzcEVkZ2VzIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZTFkN2Q1IiAvPjxyZWN0IHdpZHRoPSIxNDAiIGhlaWdodD0iMTAiIHg9IjkwIiB5PSIyMTAiIGZpbGw9IiMxZjFkMjkiIC8+PHJlY3Qgd2lkdGg9IjE0MCIgaGVpZ2h0PSIxMCIgeD0iOTAiIHk9IjIyMCIgZmlsbD0iIzFmMWQyOSIgLz48cmVjdCB3aWR0aD0iMTQwIiBoZWlnaHQ9IjEwIiB4PSI5MCIgeT0iMjMwIiBmaWxsPSIjMWYxZDI5IiAvPjxyZWN0IHdpZHRoPSIxNDAiIGhlaWdodD0iMTAiIHg9IjkwIiB5PSIyNDAiIGZpbGw9IiMxZjFkMjkiIC8+PHJlY3Qgd2lkdGg9IjIwIiBoZWlnaHQ9IjEwIiB4PSI5MCIgeT0iMjUwIiBmaWxsPSIjMWYxZDI5IiAvPjxyZWN0IHdpZHRoPSIxMTAiIGhlaWdodD0iMTAiIHg9IjEyMCIgeT0iMjUwIiBmaWxsPSIjMWYxZDI5IiAvPjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIxMCIgeD0iOTAiIHk9IjI2MCIgZmlsbD0iIzFmMWQyOSIgLz48cmVjdCB3aWR0aD0iMTEwIiBoZWlnaHQ9IjEwIiB4PSIxMjAiIHk9IjI2MCIgZmlsbD0iIzFmMWQyOSIgLz48cmVjdCB3aWR0aD0iMjAiIGhlaWdodD0iMTAiIHg9IjkwIiB5PSIyNzAiIGZpbGw9IiMxZjFkMjkiIC8+PHJlY3Qgd2lkdGg9IjExMCIgaGVpZ2h0PSIxMCIgeD0iMTIwIiB5PSIyNzAiIGZpbGw9IiMxZjFkMjkiIC8+PHJlY3Qgd2lkdGg9IjIwIiBoZWlnaHQ9IjEwIiB4PSI5MCIgeT0iMjgwIiBmaWxsPSIjMWYxZDI5IiAvPjxyZWN0IHdpZHRoPSIxMTAiIGhlaWdodD0iMTAiIHg9IjEyMCIgeT0iMjgwIiBmaWxsPSIjMWYxZDI5IiAvPjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIxMCIgeD0iOTAiIHk9IjI5MCIgZmlsbD0iIzFmMWQyOSIgLz48cmVjdCB3aWR0aD0iMTEwIiBoZWlnaHQ9IjEwIiB4PSIxMjAiIHk9IjI5MCIgZmlsbD0iIzFmMWQyOSIgLz48cmVjdCB3aWR0aD0iMjAiIGhlaWdodD0iMTAiIHg9IjkwIiB5PSIzMDAiIGZpbGw9IiMxZjFkMjkiIC8+PHJlY3Qgd2lkdGg9IjExMCIgaGVpZ2h0PSIxMCIgeD0iMTIwIiB5PSIzMDAiIGZpbGw9IiMxZjFkMjkiIC8+PHJlY3Qgd2lkdGg9IjIwIiBoZWlnaHQ9IjEwIiB4PSI5MCIgeT0iMzEwIiBmaWxsPSIjMWYxZDI5IiAvPjxyZWN0IHdpZHRoPSIxMTAiIGhlaWdodD0iMTAiIHg9IjEyMCIgeT0iMzEwIiBmaWxsPSIjMWYxZDI5IiAvPjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIxMCIgeD0iMTMwIiB5PSIyMjAiIGZpbGw9IiM2NDhkZjkiIC8+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiB4PSIxNjAiIHk9IjIyMCIgZmlsbD0iI2ZhNmZlMiIgLz48cmVjdCB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHg9IjE5MCIgeT0iMjIwIiBmaWxsPSIjZmE2ZmUyIiAvPjxyZWN0IHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgeD0iMTEwIiB5PSIyMzAiIGZpbGw9IiM2NDhkZjkiIC8+PHJlY3Qgd2lkdGg9IjMwIiBoZWlnaHQ9IjEwIiB4PSIxMzAiIHk9IjIzMCIgZmlsbD0iIzY0OGRmOSIgLz48cmVjdCB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHg9IjE4MCIgeT0iMjMwIiBmaWxsPSIjZmE2ZmUyIiAvPjxyZWN0IHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgeD0iMTIwIiB5PSIyNDAiIGZpbGw9IiM2NDhkZjkiIC8+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiB4PSIxNjAiIHk9IjI0MCIgZmlsbD0iIzY0OGRmOSIgLz48cmVjdCB3aWR0aD0iMjAiIGhlaWdodD0iMTAiIHg9IjE5MCIgeT0iMjQwIiBmaWxsPSIjZmE2ZmUyIiAvPjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIxMCIgeD0iMTQwIiB5PSIyNTAiIGZpbGw9IiNmZmU5MzkiIC8+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiB4PSIxNzAiIHk9IjI1MCIgZmlsbD0iIzY0OGRmOSIgLz48cmVjdCB3aWR0aD0iMjAiIGhlaWdodD0iMTAiIHg9IjE5MCIgeT0iMjUwIiBmaWxsPSIjZmE2ZmUyIiAvPjxyZWN0IHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgeD0iMTMwIiB5PSIyNjAiIGZpbGw9IiNmZmU5MzkiIC8+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiB4PSIxNTAiIHk9IjI2MCIgZmlsbD0iIzRiZWE2OSIgLz48cmVjdCB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHg9IjE2MCIgeT0iMjYwIiBmaWxsPSIjZmZlOTM5IiAvPjxyZWN0IHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgeD0iMTcwIiB5PSIyNjAiIGZpbGw9IiM2NDhkZjkiIC8+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiB4PSIxOTAiIHk9IjI2MCIgZmlsbD0iI2ZhNmZlMiIgLz48cmVjdCB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHg9IjEyMCIgeT0iMjcwIiBmaWxsPSIjZmZlOTM5IiAvPjxyZWN0IHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgeD0iMTQwIiB5PSIyNzAiIGZpbGw9IiM0YmVhNjkiIC8+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiB4PSIxNTAiIHk9IjI3MCIgZmlsbD0iI2ZhNmZlMiIgLz48cmVjdCB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHg9IjE2MCIgeT0iMjcwIiBmaWxsPSIjNjQ4ZGY5IiAvPjxyZWN0IHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgeD0iMTgwIiB5PSIyNzAiIGZpbGw9IiNmYTZmZTIiIC8+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiB4PSIyMDAiIHk9IjI3MCIgZmlsbD0iIzRiZWE2OSIgLz48cmVjdCB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHg9IjEyMCIgeT0iMjgwIiBmaWxsPSIjZmZlOTM5IiAvPjxyZWN0IHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgeD0iMTQwIiB5PSIyODAiIGZpbGw9IiM0YmVhNjkiIC8+PHJlY3Qgd2lkdGg9IjIwIiBoZWlnaHQ9IjEwIiB4PSIxNjAiIHk9IjI4MCIgZmlsbD0iI2ZhNmZlMiIgLz48cmVjdCB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHg9IjEyMCIgeT0iMjkwIiBmaWxsPSIjZmZlOTM5IiAvPjxyZWN0IHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgeD0iMTUwIiB5PSIyOTAiIGZpbGw9IiM0YmVhNjkiIC8+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiB4PSIxOTAiIHk9IjI5MCIgZmlsbD0iIzRiZWE2OSIgLz48cmVjdCB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHg9IjEzMCIgeT0iMzAwIiBmaWxsPSIjZmZlOTM5IiAvPjxyZWN0IHdpZHRoPSIzMCIgaGVpZ2h0PSIxMCIgeD0iMTYwIiB5PSIzMDAiIGZpbGw9IiM0YmVhNjkiIC8+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiB4PSIyMDAiIHk9IjMwMCIgZmlsbD0iIzRiZWE2OSIgLz48cmVjdCB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHg9IjEyMCIgeT0iMzEwIiBmaWxsPSIjZmZlOTM5IiAvPjxyZWN0IHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgeD0iMTUwIiB5PSIzMTAiIGZpbGw9IiNmZmU5MzkiIC8+PHJlY3Qgd2lkdGg9IjIwIiBoZWlnaHQ9IjEwIiB4PSIxNzAiIHk9IjMxMCIgZmlsbD0iIzRiZWE2OSIgLz48cmVjdCB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHg9IjE5MCIgeT0iNjAiIGZpbGw9IiNhMzg2NTQiIC8+PHJlY3Qgd2lkdGg9IjcwIiBoZWlnaHQ9IjEwIiB4PSIxNzAiIHk9IjcwIiBmaWxsPSIjNzQ1ODBkIiAvPjxyZWN0IHdpZHRoPSIzMCIgaGVpZ2h0PSIxMCIgeD0iMTUwIiB5PSI4MCIgZmlsbD0iIzc0NTgwZCIgLz48cmVjdCB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHg9IjE4MCIgeT0iODAiIGZpbGw9IiNhMzg2NTQiIC8+PHJlY3Qgd2lkdGg9IjcwIiBoZWlnaHQ9IjEwIiB4PSIxOTAiIHk9IjgwIiBmaWxsPSIjNzQ1ODBkIiAvPjxyZWN0IHdpZHRoPSIxMTAiIGhlaWdodD0iMTAiIHg9IjEyMCIgeT0iOTAiIGZpbGw9IiM3NDU4MGQiIC8+PHJlY3Qgd2lkdGg9IjIwIiBoZWlnaHQ9IjEwIiB4PSIyMzAiIHk9IjkwIiBmaWxsPSIjYTM4NjU0IiAvPjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIxMCIgeD0iMjUwIiB5PSI5MCIgZmlsbD0iIzc0NTgwZCIgLz48cmVjdCB3aWR0aD0iMTUwIiBoZWlnaHQ9IjEwIiB4PSI5MCIgeT0iMTAwIiBmaWxsPSIjNzQ1ODBkIiAvPjxyZWN0IHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgeD0iMjQwIiB5PSIxMDAiIGZpbGw9IiNhMzg2NTQiIC8+PHJlY3Qgd2lkdGg9IjIwIiBoZWlnaHQ9IjEwIiB4PSIyNTAiIHk9IjEwMCIgZmlsbD0iIzc0NTgwZCIgLz48cmVjdCB3aWR0aD0iMjIwIiBoZWlnaHQ9IjEwIiB4PSI2MCIgeT0iMTEwIiBmaWxsPSIjNzQ1ODBkIiAvPjxyZWN0IHdpZHRoPSIyMzAiIGhlaWdodD0iMTAiIHg9IjUwIiB5PSIxMjAiIGZpbGw9IiM3NDU4MGQiIC8+PHJlY3Qgd2lkdGg9IjI0MCIgaGVpZ2h0PSIxMCIgeD0iNDAiIHk9IjEzMCIgZmlsbD0iIzc0NTgwZCIgLz48cmVjdCB3aWR0aD0iMjQwIiBoZWlnaHQ9IjEwIiB4PSI0MCIgeT0iMTQwIiBmaWxsPSIjNzQ1ODBkIiAvPjxyZWN0IHdpZHRoPSIyNDAiIGhlaWdodD0iMTAiIHg9IjQwIiB5PSIxNTAiIGZpbGw9IiM3NDU4MGQiIC8+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiB4PSIyODAiIHk9IjE1MCIgZmlsbD0iI2EzODY1NCIgLz48cmVjdCB3aWR0aD0iMjQwIiBoZWlnaHQ9IjEwIiB4PSI0MCIgeT0iMTYwIiBmaWxsPSIjNzQ1ODBkIiAvPjxyZWN0IHdpZHRoPSIxNjAiIGhlaWdodD0iMTAiIHg9IjQwIiB5PSIxNzAiIGZpbGw9IiM3NDU4MGQiIC8+PHJlY3Qgd2lkdGg9IjIwIiBoZWlnaHQ9IjEwIiB4PSIyMDAiIHk9IjE3MCIgZmlsbD0iI2EzODY1NCIgLz48cmVjdCB3aWR0aD0iNTAiIGhlaWdodD0iMTAiIHg9IjIyMCIgeT0iMTcwIiBmaWxsPSIjNzQ1ODBkIiAvPjxyZWN0IHdpZHRoPSI5MCIgaGVpZ2h0PSIxMCIgeD0iNTAiIHk9IjE4MCIgZmlsbD0iIzc0NTgwZCIgLz48cmVjdCB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHg9IjE0MCIgeT0iMTgwIiBmaWxsPSIjMDAwMDAwIiAvPjxyZWN0IHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgeD0iMTUwIiB5PSIxODAiIGZpbGw9IiNmZmZmZmYiIC8+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiB4PSIxNjAiIHk9IjE4MCIgZmlsbD0iIzAwMDAwMCIgLz48cmVjdCB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHg9IjE3MCIgeT0iMTgwIiBmaWxsPSIjZmZmZmZmIiAvPjxyZWN0IHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgeD0iMTgwIiB5PSIxODAiIGZpbGw9IiMwMDAwMDAiIC8+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiB4PSIxOTAiIHk9IjE4MCIgZmlsbD0iIzc0NTgwZCIgLz48cmVjdCB3aWR0aD0iMjAiIGhlaWdodD0iMTAiIHg9IjIwMCIgeT0iMTgwIiBmaWxsPSIjYTM4NjU0IiAvPjxyZWN0IHdpZHRoPSI1MCIgaGVpZ2h0PSIxMCIgeD0iMjIwIiB5PSIxODAiIGZpbGw9IiM3NDU4MGQiIC8+PHJlY3Qgd2lkdGg9IjUwIiBoZWlnaHQ9IjEwIiB4PSI2MCIgeT0iMTkwIiBmaWxsPSIjNzQ1ODBkIiAvPjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIxMCIgeD0iMTEwIiB5PSIxOTAiIGZpbGw9IiNhMzg2NTQiIC8+PHJlY3Qgd2lkdGg9IjEzMCIgaGVpZ2h0PSIxMCIgeD0iMTMwIiB5PSIxOTAiIGZpbGw9IiM3NDU4MGQiIC8+PHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjEwIiB4PSI3MCIgeT0iMjAwIiBmaWxsPSIjNzQ1ODBkIiAvPjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIxMCIgeD0iMTEwIiB5PSIyMDAiIGZpbGw9IiNhMzg2NTQiIC8+PHJlY3Qgd2lkdGg9IjExMCIgaGVpZ2h0PSIxMCIgeD0iMTMwIiB5PSIyMDAiIGZpbGw9IiM3NDU4MGQiIC8+PHJlY3Qgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMCIgeD0iMTAwIiB5PSIyMTAiIGZpbGw9IiM3NDU4MGQiIC8+PHJlY3Qgd2lkdGg9IjYwIiBoZWlnaHQ9IjEwIiB4PSIxMDAiIHk9IjExMCIgZmlsbD0iIzRiZWE2OSIgLz48cmVjdCB3aWR0aD0iNjAiIGhlaWdodD0iMTAiIHg9IjE3MCIgeT0iMTEwIiBmaWxsPSIjNGJlYTY5IiAvPjxyZWN0IHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgeD0iMTAwIiB5PSIxMjAiIGZpbGw9IiM0YmVhNjkiIC8+PHJlY3Qgd2lkdGg9IjIwIiBoZWlnaHQ9IjEwIiB4PSIxMTAiIHk9IjEyMCIgZmlsbD0iI2ZmZmZmZiIgLz48cmVjdCB3aWR0aD0iMjAiIGhlaWdodD0iMTAiIHg9IjEzMCIgeT0iMTIwIiBmaWxsPSIjMDAwMDAwIiAvPjxyZWN0IHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgeD0iMTUwIiB5PSIxMjAiIGZpbGw9IiM0YmVhNjkiIC8+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiB4PSIxNzAiIHk9IjEyMCIgZmlsbD0iIzRiZWE2OSIgLz48cmVjdCB3aWR0aD0iMjAiIGhlaWdodD0iMTAiIHg9IjE4MCIgeT0iMTIwIiBmaWxsPSIjZmZmZmZmIiAvPjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIxMCIgeD0iMjAwIiB5PSIxMjAiIGZpbGw9IiMwMDAwMDAiIC8+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiB4PSIyMjAiIHk9IjEyMCIgZmlsbD0iIzRiZWE2OSIgLz48cmVjdCB3aWR0aD0iNDAiIGhlaWdodD0iMTAiIHg9IjcwIiB5PSIxMzAiIGZpbGw9IiM0YmVhNjkiIC8+PHJlY3Qgd2lkdGg9IjIwIiBoZWlnaHQ9IjEwIiB4PSIxMTAiIHk9IjEzMCIgZmlsbD0iI2ZmZmZmZiIgLz48cmVjdCB3aWR0aD0iMjAiIGhlaWdodD0iMTAiIHg9IjEzMCIgeT0iMTMwIiBmaWxsPSIjMDAwMDAwIiAvPjxyZWN0IHdpZHRoPSIzMCIgaGVpZ2h0PSIxMCIgeD0iMTUwIiB5PSIxMzAiIGZpbGw9IiM0YmVhNjkiIC8+PHJlY3Qgd2lkdGg9IjIwIiBoZWlnaHQ9IjEwIiB4PSIxODAiIHk9IjEzMCIgZmlsbD0iI2ZmZmZmZiIgLz48cmVjdCB3aWR0aD0iMjAiIGhlaWdodD0iMTAiIHg9IjIwMCIgeT0iMTMwIiBmaWxsPSIjMDAwMDAwIiAvPjxyZWN0IHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgeD0iMjIwIiB5PSIxMzAiIGZpbGw9IiM0YmVhNjkiIC8+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiB4PSI3MCIgeT0iMTQwIiBmaWxsPSIjNGJlYTY5IiAvPjxyZWN0IHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgeD0iMTAwIiB5PSIxNDAiIGZpbGw9IiM0YmVhNjkiIC8+PHJlY3Qgd2lkdGg9IjIwIiBoZWlnaHQ9IjEwIiB4PSIxMTAiIHk9IjE0MCIgZmlsbD0iI2ZmZmZmZiIgLz48cmVjdCB3aWR0aD0iMjAiIGhlaWdodD0iMTAiIHg9IjEzMCIgeT0iMTQwIiBmaWxsPSIjMDAwMDAwIiAvPjxyZWN0IHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgeD0iMTUwIiB5PSIxNDAiIGZpbGw9IiM0YmVhNjkiIC8+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiB4PSIxNzAiIHk9IjE0MCIgZmlsbD0iIzRiZWE2OSIgLz48cmVjdCB3aWR0aD0iMjAiIGhlaWdodD0iMTAiIHg9IjE4MCIgeT0iMTQwIiBmaWxsPSIjZmZmZmZmIiAvPjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIxMCIgeD0iMjAwIiB5PSIxNDAiIGZpbGw9IiMwMDAwMDAiIC8+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiB4PSIyMjAiIHk9IjE0MCIgZmlsbD0iIzRiZWE2OSIgLz48cmVjdCB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHg9IjcwIiB5PSIxNTAiIGZpbGw9IiM0YmVhNjkiIC8+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiB4PSIxMDAiIHk9IjE1MCIgZmlsbD0iIzRiZWE2OSIgLz48cmVjdCB3aWR0aD0iMjAiIGhlaWdodD0iMTAiIHg9IjExMCIgeT0iMTUwIiBmaWxsPSIjZmZmZmZmIiAvPjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIxMCIgeD0iMTMwIiB5PSIxNTAiIGZpbGw9IiMwMDAwMDAiIC8+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiB4PSIxNTAiIHk9IjE1MCIgZmlsbD0iIzRiZWE2OSIgLz48cmVjdCB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHg9IjE3MCIgeT0iMTUwIiBmaWxsPSIjNGJlYTY5IiAvPjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIxMCIgeD0iMTgwIiB5PSIxNTAiIGZpbGw9IiNmZmZmZmYiIC8+PHJlY3Qgd2lkdGg9IjIwIiBoZWlnaHQ9IjEwIiB4PSIyMDAiIHk9IjE1MCIgZmlsbD0iIzAwMDAwMCIgLz48cmVjdCB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHg9IjIyMCIgeT0iMTUwIiBmaWxsPSIjNGJlYTY5IiAvPjxyZWN0IHdpZHRoPSI2MCIgaGVpZ2h0PSIxMCIgeD0iMTAwIiB5PSIxNjAiIGZpbGw9IiM0YmVhNjkiIC8+PHJlY3Qgd2lkdGg9IjYwIiBoZWlnaHQ9IjEwIiB4PSIxNzAiIHk9IjE2MCIgZmlsbD0iIzRiZWE2OSIgLz48L3N2Zz4=`;

  return {
    name,
    description,
    image,
  };
};

export const StandaloneVrbImage: React.FC<StandaloneVrbProps> = (
  props: StandaloneVrbProps,
) => {
  const { vrbId } = props;
  const seed = useVrbSeed(vrbId);
  const vrb = seed && getVrb(vrbId, seed);

  return <Image src={vrb ? vrb.image : ''} fluid />;
};

const StandaloneVrb: React.FC<StandaloneVrbProps> = (props: StandaloneVrbProps) => {
  const { vrbId } = props;
  const seed = useVrbSeed(vrbId);
  const vrb = seed && getVrb(vrbId, seed);

  const dispatch = useDispatch();

  const onClickHandler = () => {
    dispatch(setOnDisplayAuctionVrbId(vrbId.toNumber()));
  };

  return (
    <Link
      to={'/vrb/' + vrbId.toString()}
      className={classes.clickableVrb}
      onClick={onClickHandler}
    >
      <Vrb imgPath={vrb ? vrb.image : ''} alt={vrb ? vrb.description : 'Vrb'} />
    </Link>
  );
};

export const StandaloneVrbCircular: React.FC<StandaloneCircularVrbProps> = (
  props: StandaloneCircularVrbProps,
) => {
  const { vrbId, border } = props;
  const seed = useVrbSeed(vrbId);
  const vrb = seed && getVrb(vrbId, seed);

  const dispatch = useDispatch();
  const onClickHandler = () => {
    dispatch(setOnDisplayAuctionVrbId(vrbId.toNumber()));
  };

  if (!seed || !vrbId) return <Vrb imgPath="" alt="Vrb" />;

  return (
    <Link
      to={'/vrb/' + vrbId.toString()}
      className={classes.clickableVrb}
      onClick={onClickHandler}
    >
      <Vrb
        imgPath={vrb ? vrb.image : ''}
        alt={vrb ? vrb.description : 'Vrb'}
        wrapperClassName={vrbClasses.circularVrbWrapper}
        className={border ? vrbClasses.circleWithBorder : vrbClasses.circular}
      />
    </Link>
  );
};

export const StandaloneVrbRoundedCorners: React.FC<StandaloneVrbProps> = (
  props: StandaloneVrbProps,
) => {
  const { vrbId } = props;
  const seed = useVrbSeed(vrbId);
  const vrb = seed && getVrb(vrbId, seed);

  const dispatch = useDispatch();
  const onClickHandler = () => {
    dispatch(setOnDisplayAuctionVrbId(vrbId.toNumber()));
  };

  return (
    <Link
      to={'/vrb/' + vrbId.toString()}
      className={classes.clickableVrb}
      onClick={onClickHandler}
    >
      <Vrb
        imgPath={vrb ? vrb.image : ''}
        alt={vrb ? vrb.description : 'Vrb'}
        className={vrbClasses.rounded}
      />
    </Link>
  );
};

export const StandaloneVrbWithSeed: React.FC<StandaloneVrbWithSeedProps> = (
  props: StandaloneVrbWithSeedProps,
) => {
  const { vrbId, onLoadSeed, shouldLinkToProfile } = props;
  const dispatch = useDispatch();
  const seed = useVrbSeed(vrbId);
  const seedIsInvalid = Object.values(seed || {}).every(v => v === 0);

  //prev seed
  // const pastAuctions = useAppSelector(state => state.pastAuctions.pastAuctions);
  const prevID = BigNumber.from(vrbId.toNumber() -1);
  const prevSeed = useVrbSeed(prevID);
  const prev: { image:string, description:string } = getVrb(prevID, prevSeed);
  // console.log(prev);

  if (!seed || seedIsInvalid || !vrbId || !onLoadSeed) return <Vrb imgPath="" alt="Vrb" />;

  onLoadSeed(seed);

  const onClickHandler = () => {
    dispatch(setOnDisplayAuctionVrbId(vrbId.toNumber()));
  };

  const { image, description } = getVrb(vrbId, seed);
console.log(image);
// console.log(pastAuctions);
  const slideData = [
    {},
    {},
    {}
  ]
  
  let slides = [
    <SwiperSlide key={0} className={classes.swiperSlide}>
      <Vrb imgPath={fomo} alt={description} />
    </SwiperSlide>,
        <SwiperSlide key={1} className={classes.swiperSlide}>
        <Vrb imgPath={image} alt={description} />
      </SwiperSlide>,
      <SwiperSlide key={2} className={classes.swiperSlide}>
        <Vrb imgPath={prev.image} alt={prev.description} />
      </SwiperSlide>
  ];
  
  let i = 3;
  let slidesMain = slideData.map((team) => (
    <SwiperSlide key={i++} className={classes.swiperSlide}>
      <Vrb imgPath={image} alt={description} />
    </SwiperSlide>
  ));

  slides.push(...slidesMain);

  const swiperEl = (
    <Swiper
      onSwiper={(swiper) => {swiper.changeLanguageDirection('rtl')}}
      onSlideChange={(swiper) => {console.log(swiper)}}
      initialSlide={1}
      effect={"coverflow"}
      grabCursor={true}
      centeredSlides={true}
      slidesPerView={"auto"}
      coverflowEffect={{
        rotate: 20,
        stretch: 0,
        depth: 250,
        modifier: 1,
        slideShadows: true,
      }}
      pagination={false}
      modules={[EffectCoverflow, Pagination]}
    >
      {slides}
    </Swiper>
  );

  const vrbWithLink = (
    <Link
      to={'/vrb/' + vrbId.toString()}
      className={classes.clickableVrb}
      onClick={onClickHandler}
    >
      {swiperEl}
    </Link>
  );
  return shouldLinkToProfile ? vrbWithLink : swiperEl;
};

export default StandaloneVrb;
